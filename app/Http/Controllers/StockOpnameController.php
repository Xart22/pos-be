<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\Recipe;
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
        try {
            // ==========================
            // 1. HANDLE TANGGAL
            // ==========================
            $startDate = $start
                ? Carbon::parse($start)->startOfDay()
                : now()->startOfMonth();

            $endDate = $end
                ? Carbon::parse($end)->endOfDay()
                : now()->endOfDay();

            $foodCategory  = [2, 3, 4, 5, 6, 7, 8, 9, 18];
            $drinkCategory = [1, 10, 11, 12, 14, 16, 17];

            $foodSet  = array_flip($foodCategory);
            $drinkSet = array_flip($drinkCategory);

            $transFood      = [];
            $transDrink     = [];
            $transUnknown   = [];
            $sumIngredients = [];

            // Kalau butuh dikirim ke FE
            $bahanBakus = BahanBaku::all();

            // ==========================
            // 2. PROSES TRANSAKSI PAKAI CHUNK (HEMAT RAM)
            // ==========================
            Transaction::with([
                'details.menu.category',
                'details.menu.recipes.bahanBakus.bahanBaku',
                'details.variants.variantOption.variant',
            ])
                ->whereBetween('created_at', [$startDate, $endDate])
                ->orderBy('id') // wajib untuk chunkById
                ->chunkById(300, function ($transactions) use (
                    &$transFood,
                    &$transDrink,
                    &$transUnknown,
                    $foodSet,
                    $drinkSet
                ) {
                    foreach ($transactions as $transaction) {
                        foreach ($transaction->details as $detail) {
                            $menu = $detail->menu;

                            if (!$menu) {
                                continue;
                            }

                            $categoryId = $menu->category->id ?? null;

                            // Hitung sekali
                            $quantity  = (int) $detail->quantity;
                            $basePrice = (float) ($menu->price ?? 0);

                            // Total harga varian per item
                            $variantPricePerItem = $detail->variants->sum(function ($variant) {
                                return (float) ($variant->variantOption->price ?? 0);
                            });

                            // Susun info variant
                            $variantItems = $detail->variants->map(function ($variant) {
                                return [
                                    'variant_name' => $variant->variantOption->variant->name ?? null,
                                    'name'         => $variant->variantOption->name ?? null,
                                    'price'        => (float) ($variant->variantOption->price ?? 0),
                                ];
                            });

                            // Nama varian utk pembeda minuman
                            $variantNames = $detail->variants
                                ->pluck('variantOption.name')
                                ->filter()
                                ->sort()
                                ->values()
                                ->all();

                            $baseKey  = $menu->name ?? 'Unknown';
                            $drinkKey = $variantNames
                                ? $baseKey . ' - ' . implode(', ', $variantNames)
                                : $baseKey;

                            // ==========================
                            // PILIH RECIPE TANPA QUERY DB
                            // ==========================
                            $recipe = $menu->recipes->first(); // default recipe

                            $lowerDrinkKey = strtolower($drinkKey);

                            if (str_contains($lowerDrinkKey, 'large')) {
                                $drinkKey = $baseKey . ' - L';

                                // cari resep yang punya variant_options_id (sudah di-eager load)
                                $recipe = $menu->recipes
                                    ->firstWhere('variant_options_id', '!=', null);
                            } elseif (str_contains($lowerDrinkKey, 'reguler')) {
                                $drinkKey = $baseKey . ' - R';

                                // resep reguler: resep pertama
                                $recipe = $menu->recipes->first();
                            }

                            // ==========================
                            // HITUNG PEMAKAIAN BAHAN BAKU
                            // ==========================
                            $usedIngredients = collect();
                            if ($recipe && $recipe->bahanBakus) {
                                $usedIngredients = $recipe->bahanBakus->map(function ($bahanResep) use ($quantity) {
                                    return [
                                        'bahan_baku_id' => $bahanResep->bahan_baku_id,
                                        'name'          => $bahanResep->bahanBaku->name ?? null,
                                        'unit'          => $bahanResep->satuan,
                                        'quantity'      => (float) $bahanResep->jumlah * $quantity,
                                        'cost'          => (float) $bahanResep->bahanBaku->harga / $bahanResep->bahanBaku->per_unit * ((float) $bahanResep->jumlah * $quantity),
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
                                'used_ingredients' => $usedIngredients,
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
                                                'cost'          => $items->sum('cost'),
                                            ];
                                        })
                                        ->values();
                                }
                            } elseif (isset($drinkSet[$categoryId])) {
                                // DRINK: gabung per menu + varian
                                $key        = $drinkKey;
                                $row['menu'] = $key;

                                if (!isset($transDrink[$key])) {
                                    $transDrink[$key] = $row;
                                } else {
                                    $transDrink[$key]['quantity']    += $row['quantity'];
                                    $transDrink[$key]['total_price'] += $row['total_price'];

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
                                                'cost'          => $items->sum('cost'),
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
                });

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
                            'cost'          => 0,
                        ];
                    }
                    $sumIngredients[$id]['quantity'] += $ingredient['quantity'];
                    $sumIngredients[$id]['cost'] += $ingredient['cost'];
                }
            }

            return Inertia::render('stock-opname/page', [
                'startDate'            => $startDate->toDateString(),
                'endDate'              => $endDate->toDateString(),
                'transactions_food'    => array_values($transFood),
                'transactions_drink'   => array_values($transDrink),
                'transactions_unknown' => $transUnknown,
                'sum_ingredients'      => array_values($sumIngredients),
                'bahan_bakus'          => $bahanBakus,
            ]);
        } catch (\Throwable $th) {
            return redirect()
                ->back()
                ->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
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
