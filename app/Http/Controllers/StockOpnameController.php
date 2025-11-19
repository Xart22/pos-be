<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class StockOpnameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($start = null, $end = null)
    {
        // ==========================
        // 1. HANDLE TANGGAL
        // ==========================
        $startDate = $start
            ? Carbon::parse($start)->startOfDay()
            : now()->startOfMonth();

        $endDate = $end
            ? Carbon::parse($end)->endOfDay()
            : now()->endOfDay();

        // ==========================
        // 2. AMBIL TRANSAKSI + EAGER LOAD
        // ==========================
        $transactions = Transaction::with([
            'details.menu.category',
            'details.menu.recipes.bahanBakus.bahanBaku',
            'details.variants.variantOption.variant',
        ])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        // Kalau mau kirim master bahan baku ke frontend
        $bahanBakus = BahanBaku::all();

        $foodCategory  = [2, 3, 4, 5, 6, 7, 8, 9, 18];
        $drinkCategory = [1, 10, 11, 12, 14, 16, 17];

        $transFood       = [];
        $transDrink      = [];
        $transUnknown    = [];
        $sumIngredients  = [];

        // Ubah category list jadi "set" supaya lookup O(1)
        $foodSet  = array_flip($foodCategory ?? []);
        $drinkSet = array_flip($drinkCategory ?? []);

        foreach ($transactions as $transaction) {
            foreach ($transaction->details as $detail) {
                $menu = $detail->menu;

                if (!$menu) {
                    continue; // kalau menu null, skip
                }

                $categoryId = $menu->category->id ?? null;

                // Hitung sekali saja
                $quantity  = (int) $detail->quantity;
                $basePrice = (float) ($menu->price ?? 0);

                // Total harga varian per item
                $variantPricePerItem = $detail->variants
                    ->sum(function ($variant) {
                        return (float) ($variant->variantOption->price ?? 0);
                    });

                // Susun info variant (nama, harga, dsb)
                $variantItems = $detail->variants->map(function ($variant) {
                    return [
                        'variant_name' => $variant->variantOption->variant->name ?? null,
                        'name'         => $variant->variantOption->name ?? null,
                        'price'        => (float) ($variant->variantOption->price ?? 0),
                    ];
                });

                // Untuk pembeda menu minuman, gunakan nama varian yang diurutkan agar konsisten
                $variantNames = $detail->variants
                    ->pluck('variantOption.name')
                    ->filter()
                    ->sort()
                    ->values()
                    ->all();

                // BUAT KEY:
                // - Food: gabung berdasarkan nama menu saja
                // - Drink: kalau ada varian, gabung per "menu + varian"
                $baseKey  = $menu->name ?? 'Unknown';
                $drinkKey = $variantNames
                    ? $baseKey . ' - ' . implode(', ', $variantNames)
                    : $baseKey;

                // Normalisasi Large / Reguler
                $lowerDrinkKey = strtolower($drinkKey);
                if (str_contains($lowerDrinkKey, 'large')) {
                    $drinkKey = $baseKey . ' - L';
                } elseif (str_contains($lowerDrinkKey, 'reguler')) {
                    $drinkKey = $baseKey . ' - R';
                }

                // ==========================
                // HITUNG RESEP & BAHAN BAKU
                // ==========================
                $recipe = $menu->recipes->first();

                $usedIngredients = collect();
                if ($recipe && $recipe->bahanBakus) {
                    // Map bahan baku dan kalikan dengan quantity terjual
                    $usedIngredients = $recipe->bahanBakus->map(function ($bahanResep) use ($quantity) {
                        return [
                            // ASUMSI: field di pivot bernama 'bahan_baku_id'
                            'bahan_baku_id' => $bahanResep->bahan_baku_id,
                            'name'          => $bahanResep->bahanBaku->name ?? null,
                            'unit'          => $bahanResep->satuan,
                            'quantity'      => (float) $bahanResep->jumlah * $quantity,
                        ];
                    });
                }

                // ==========================
                // NORMALIZED ROW
                // ==========================
                $row = [
                    'name'             => $baseKey,
                    'category'         => $categoryId,
                    'quantity'         => $quantity,
                    'base_price'       => $basePrice,
                    'variant_price'    => $variantPricePerItem,
                    'total_price'      => ($basePrice + $variantPricePerItem) * $quantity,
                    'variants'         => $variantItems,
                    'recipe'           => $recipe ? $recipe->bahanBakus : collect(),
                    'used_ingredients' => $usedIngredients, // Collection
                ];

                // ==========================
                // MASUKKAN KE BUCKET
                // ==========================
                if (isset($foodSet[$categoryId])) {
                    // FOOD: gabung per nama menu
                    $key = $baseKey;

                    if (!isset($transFood[$key])) {
                        $transFood[$key] = $row;
                    } else {
                        $transFood[$key]['quantity']    += $row['quantity'];
                        $transFood[$key]['total_price'] += $row['total_price'];

                        // Gabungkan juga used_ingredients untuk food
                        $transFood[$key]['used_ingredients'] = $transFood[$key]['used_ingredients']
                            ->merge($row['used_ingredients'])
                            ->groupBy('bahan_baku_id')
                            ->map(function ($items) {
                                $first = $items->first();

                                return [
                                    'bahan_baku_id' => $first['bahan_baku_id'],
                                    'name'          => $first['name'],
                                    'unit'          => $first['unit'],
                                    'quantity'      => $items->sum('quantity'),
                                ];
                            })
                            ->values();
                    }
                } elseif (isset($drinkSet[$categoryId])) {
                    // DRINK: gabung per menu + varian
                    $key        = $drinkKey;
                    $row['menu'] = $key; // label tampil nama+varian

                    if (!isset($transDrink[$key])) {
                        $transDrink[$key] = $row;
                    } else {
                        $transDrink[$key]['quantity']    += $row['quantity'];
                        $transDrink[$key]['total_price'] += $row['total_price'];

                        // Gabungkan used_ingredients untuk drink
                        $transDrink[$key]['used_ingredients'] = $transDrink[$key]['used_ingredients']
                            ->merge($row['used_ingredients'])
                            ->groupBy('bahan_baku_id')
                            ->map(function ($items) {
                                $first = $items->first();

                                return [
                                    'bahan_baku_id' => $first['bahan_baku_id'],
                                    'name'          => $first['name'],
                                    'unit'          => $first['unit'],
                                    'quantity'      => $items->sum('quantity'),
                                ];
                            })
                            ->values();
                    }
                } else {
                    // UNKNOWN CATEGORY
                    $transUnknown[] = $row;
                }
            }
        }

        // ==========================
        // SUM BAHAN BAKU KESELURUHAN (FOOD + DRINK)
        // ==========================
        $allItems = array_merge(array_values($transFood), array_values($transDrink));

        foreach ($allItems as $item) {
            foreach ($item['used_ingredients'] as $ingredient) {
                $id = $ingredient['bahan_baku_id'];

                if (!isset($sumIngredients[$id])) {
                    $sumIngredients[$id] = [
                        'bahan_baku_id' => $id,
                        'name'          => $ingredient['name'],
                        'unit'          => $ingredient['unit'],
                        'quantity'      => 0,
                    ];
                }

                $sumIngredients[$id]['quantity'] += $ingredient['quantity'];
            }
        }
        // ==========================
        // RETURN KE INERTIA
        // ==========================
        return Inertia::render('stock-opname/page', [
            'startDate'             => $startDate->toDateString(),
            'endDate'               => $endDate->toDateString(),
            'transactions_food'     => array_values($transFood),
            'transactions_drink'    => array_values($transDrink),
            'transactions_unknown'  => $transUnknown,
            'sum_ingredients'       => array_values($sumIngredients),
            'bahan_bakus'           => $bahanBakus,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
