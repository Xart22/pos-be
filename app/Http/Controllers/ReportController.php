<?php

namespace App\Http\Controllers;

use App\Models\CashOut;
use App\Models\Operational;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $now = now();
        if ($request->input('period')) {
            $period = $request->input('period');
        } else {
            $now = now();
        }


        // Periode bulan berjalan: 1 s/d akhir bulan
        $startOfPeriod = $now->copy()->startOfMonth();
        $endOfPeriod   = $now->copy()->endOfMonth();


        $operational = Operational::get();
        $sumOperational = $operational->sum('price');
        $cashOut = CashOut::whereBetween('tanggal', [$startOfPeriod, $endOfPeriod])->get();


        //merge cashout if same tanggal
        $cashOut = $cashOut->groupBy('tanggal')->map(function ($item, $key) {
            return [
                'tanggal' => $key,
                'description' => $item->pluck('description')->join('<br>'),
                'amount' => $item->sum('amount'),
            ];
        })->values();
        $users = User::query()
            ->where('role', '!=', 'admin')
            ->withCount(['absensi as hadir_count' => function ($q) use ($startOfPeriod, $endOfPeriod) {
                $q->whereBetween('tanggal', [$startOfPeriod, $endOfPeriod]);
            }])->withCount(['absensi as shift' => function ($q) use ($startOfPeriod, $endOfPeriod) {
                $q->whereBetween('tanggal', [$startOfPeriod, $endOfPeriod])->where('shift', 'Full Time');
            }])
            ->with(['cashbon' => function ($q) use ($startOfPeriod, $endOfPeriod) {
                $q->whereBetween('tanggal', [$startOfPeriod, $endOfPeriod])->where('status', 'Disetujui');
            }])
            ->get();

        foreach ($users as $u) {
            $gajiHadir = (int)$u->hadir_count * ((float)$u->base_gaji / 26);
            $totalCashbon = (float)$u->cashbon->sum('jumlah');
            $gajiFulltime = (int)$u->shift * ((float)$u->base_gaji / 26);
            $gajiHadir += $gajiFulltime;

            $data_karyawan[] = [
                'name' => $u->name,
                'base_gaji' => (float)$u->base_gaji,
                'total_gaji' => $gajiHadir,
                'cashbon' => $u->cashbon->values(),
                'total_cashbon' => $totalCashbon,
                'gaji_bersih' => $gajiHadir - $totalCashbon,
                'hadir' => (int)$u->hadir_count,
                'full_time' => $u->shift,
            ];
        }


        $usedIngredients = $this->generateReport($startOfPeriod, $endOfPeriod);
        $omset = DB::table('transactions')
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('SUM(total_price) as omset')
            ->selectRaw("SUM(CASE WHEN payment_method = 'QRIS' THEN total_price ELSE 0 END) as qris")
            ->selectRaw("SUM(CASE WHEN payment_method = 'CASH' THEN total_price ELSE 0 END) as cash")
            ->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
            ->groupByRaw('DATE(created_at)');

        $drawer = DB::table('cash_drawers')
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('SUM(opening_balance) as opening_balance')
            ->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
            ->groupByRaw('DATE(created_at)');

        $dataOmsetDaily = DB::query()
            ->fromSub($omset, 'o')
            ->leftJoinSub($drawer, 'd', 'o.date', '=', 'd.date')
            ->orderBy('o.date')
            ->get()
            ->map(fn($r) => [
                'date'          => $r->date,
                'omset'         => (float) $r->omset,
                'qris'          => (float) $r->qris,
                'opening_balance'  => (float) ($r->opening_balance ?? 0),
                'cash'          => (float) $r->cash,
                'total_cash'   => (float) $r->cash + (float) ($r->opening_balance ?? 0),
            ]);

        return Inertia::render('report/page', [
            'operational'       => $operational,
            'sum_operational'   => $sumOperational,
            'cash_out'          => $cashOut,
            'data_karyawan'     => $data_karyawan,
            'sum_ingredients'  => $usedIngredients['sum_ingredients'],
            'transactions_food' => $usedIngredients['transactions_food'],
            'transactions_drink' => $usedIngredients['transactions_drink'],
            'period' => $startOfPeriod->format('Y-m'),
            'data_omset_daily'  => $dataOmsetDaily,
        ]);
    }


    private function generateReport($startOfPeriod, $endOfPeriod)
    {
        $foodCategory  = [2, 3, 4, 5, 6, 7, 8, 9, 18];
        $drinkCategory = [1, 10, 11, 12, 14, 16, 17];

        $foodSet  = array_flip($foodCategory);
        $drinkSet = array_flip($drinkCategory);

        $transFood      = [];
        $transDrink     = [];
        $transUnknown   = [];
        $sumIngredients = [];


        // ==========================
        // 2. PROSES TRANSAKSI PAKAI CHUNK (HEMAT RAM)
        // ==========================
        Transaction::with([
            'details.menu.category',
            'details.menu.recipes.bahanBakus.bahanBaku',
            'details.variants.variantOption.variant',
        ])
            ->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
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

        return [
            'transactions_food'    => array_values($transFood),
            'transactions_drink'   => array_values($transDrink),
            'sum_ingredients'      => array_values($sumIngredients),
        ];
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
