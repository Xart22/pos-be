<?php

namespace App\Http\Controllers;

use App\Models\CashOut;
use App\Models\Operational;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($start = null, $end = null)
    {

        $startDate = $start
            ? Carbon::parse($start)->startOfDay()
            : now()->startOfMonth();

        $endDate = $end
            ? Carbon::parse($end)->endOfDay()
            : now()->endOfDay();


        $startOfPeriod = $startDate;
        $endOfPeriod = $endDate;


        $operational = Operational::get();
        $sumOperational = $operational->sum('price');
        $cashOut = CashOut::whereBetween('tanggal', [$startOfPeriod, $endOfPeriod])->get();

        $sumOperational = $sumOperational - $cashOut->where('kategori', 'Operasional')->sum('amount');
        //merge cashout if same tanggal anda kategori
        $cashOut = $cashOut
            ->groupBy(fn($x) => $x->kategori . '|' . $x->tanggal)
            ->map(function ($items, $groupKey) {
                [$kategori, $tanggal] = explode('|', $groupKey, 2);

                return [
                    'tanggal'     => $tanggal,
                    'kategori'    => $kategori,
                    'description' => $items->pluck('description')->filter()->join("\n"), // lebih aman utk React
                    'amount'      => (float) $items->sum('amount'),
                ];
            })
            ->values()
            // optional: sorting biar rapi
            ->sortBy(['tanggal', 'kategori'])
            ->values();
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
        $redemIngredients = $this->generateReport($startOfPeriod, $endOfPeriod, true);
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

        $splitOmset = $this->splitOmset($startOfPeriod, $endOfPeriod);

        $dataOmsetDaily = DB::query()
            ->fromSub($omset, 'o')
            ->leftJoinSub($drawer, 'd', 'o.date', '=', 'd.date')
            ->orderBy('o.date')
            ->get()
            ->map(function ($r) use ($splitOmset) {
                $split = $splitOmset->get($r->date); // ini array atau null

                return [
                    'date'            => $r->date,
                    'omset'           => (float) $r->omset,
                    'qris'            => (float) $r->qris,
                    'opening_balance' => (float) ($r->opening_balance ?? 0),
                    'cash'            => (float) $r->cash,
                    'total_cash'      => (float) $r->cash + (float) ($r->opening_balance ?? 0),
                    'bar'             => (float) ($split['bar'] ?? 0),
                    'kitchen'         => (float) ($split['kitchen'] ?? 0),
                    'unknown'         => (float) ($split['unknown'] ?? 0),
                ];
            });


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
            'redem_ingredients' => $redemIngredients['sum_ingredients'],
            'startDate' => $startOfPeriod->toDateString(),
            'endDate' => $endOfPeriod->toDateString(),
        ]);
    }

    private function splitOmset($startOfPeriod, $endOfPeriod)
    {
        $foodCategory  = [2, 3, 4, 5, 6, 7, 8, 9, 18];
        $drinkCategory = [1, 10, 11, 12, 14, 16, 17];

        $foodSet  = array_flip($foodCategory);
        $drinkSet = array_flip($drinkCategory);

        $splitOmset = []; // ['2025-12-01' => ['bar'=>..., 'kitchen'=>... ]]

        Transaction::query()
            ->with([
                'details.menu.category',
                'details.variants.variantOption', // buat ambil price varian
            ])
            ->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
            ->where('total_price', '!=', 0)
            ->orderBy('id')
            ->chunkById(300, function ($transactions) use (&$splitOmset, $foodSet, $drinkSet) {
                foreach ($transactions as $trx) {
                    $date = $trx->created_at->format('Y-m-d');

                    if (!isset($splitOmset[$date])) {
                        $splitOmset[$date] = ['bar' => 0.0, 'kitchen' => 0.0, 'unknown' => 0.0];
                    }

                    foreach ($trx->details as $detail) {
                        $menu = $detail->menu;
                        if (!$menu) continue;

                        $categoryId = $menu->category->id ?? null;
                        $qty = (int) ($detail->quantity ?? 0);
                        if ($qty <= 0) continue;

                        $base = (float) ($menu->price ?? 0);

                        // variant price per item (sesuai transaksi)
                        $variantPerItem = (float) $detail->variants->sum(function ($v) {
                            return (float) ($v->variantOption->price ?? 0);
                        });

                        // total detail = (base + variant) * qty
                        $detailTotal = ($base + $variantPerItem) * $qty;

                        if (isset($drinkSet[$categoryId])) {
                            $splitOmset[$date]['bar'] += $detailTotal;
                        } elseif (isset($foodSet[$categoryId])) {
                            $splitOmset[$date]['kitchen'] += $detailTotal;
                        } else {
                            $splitOmset[$date]['unknown'] += $detailTotal;
                        }
                    }
                }
            });

        // kalau mau format seperti map sebelumnya:
        $splitOmset = collect($splitOmset)->map(function ($v) {
            return [
                'bar' => (float) $v['bar'],
                'kitchen' => (float) $v['kitchen'],
                'unknown' => (float) $v['unknown'],
            ];
        });
        return $splitOmset;
    }



    private function generateReport($startOfPeriod, $endOfPeriod, $isRedem = false): array
    {
        $foodCategory  = [2, 3, 4, 5, 6, 7, 8, 9, 18];
        $drinkCategory = [1, 10, 11, 12, 14, 16, 17];

        $foodSet  = array_flip($foodCategory);
        $drinkSet = array_flip($drinkCategory);

        $transFood      = [];
        $transDrink     = [];
        $transUnknown   = [];
        $sumIngredients = [];

        $operator = $isRedem ? '=' : '>';

        Transaction::query()
            ->with([
                'details.menu.category',
                'details.menu.recipes.bahanBakus.bahanBaku',
                'details.variants.variantOption.variant',
            ])
            ->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
            ->where('total_price', $operator, 0)
            ->orderBy('id')
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
                        if (!$menu) continue;

                        $categoryId = $menu->category->id ?? null;

                        $quantity  = (int) $detail->quantity;
                        if ($quantity <= 0) continue;

                        $basePrice = (float) ($menu->price ?? 0);

                        $variantPricePerItem = (float) $detail->variants->sum(function ($variant) {
                            return (float) ($variant->variantOption->price ?? 0);
                        });

                        $variantItems = $detail->variants->map(function ($variant) {
                            return [
                                'variant_name' => $variant->variantOption->variant->name ?? null,
                                'name'         => $variant->variantOption->name ?? null,
                                'price'        => (float) ($variant->variantOption->price ?? 0),
                            ];
                        });

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
                        // PILIH RECIPE (tanpa query DB)
                        // ==========================
                        $recipe = $menu->recipes->first(); // default
                        $lowerDrinkKey = strtolower($drinkKey);

                        if (str_contains($lowerDrinkKey, 'large')) {
                            $drinkKey = $baseKey . ' - L';

                            // resep varian: variant_options_id != null
                            $recipe = $menu->recipes->firstWhere('variant_options_id', '!=', null) ?? $recipe;
                        } elseif (str_contains($lowerDrinkKey, 'reguler') || str_contains($lowerDrinkKey, 'regular')) {
                            $drinkKey = $baseKey . ' - R';
                            $recipe = $menu->recipes->first() ?? $recipe;
                        }

                        // ==========================
                        // HITUNG PEMAKAIAN BAHAN + COST (lebih aman)
                        // ==========================
                        $usedIngredients = [];

                        if ($recipe && $recipe->bahanBakus) {
                            foreach ($recipe->bahanBakus as $bahanResep) {
                                $bb = $bahanResep->bahanBaku;

                                $bahanId = (int) ($bahanResep->bahan_baku_id ?? 0);
                                if ($bahanId <= 0) continue;

                                $qtyUsed = (float) $bahanResep->jumlah * $quantity;

                                $harga   = (float) ($bb->harga ?? 0);
                                $perUnit = (float) ($bb->per_unit ?? 0);
                                if ($perUnit <= 0) $perUnit = 1; // ✅ anti div 0

                                $cost = ($harga / $perUnit) * $qtyUsed;

                                $usedIngredients[] = [
                                    'bahan_baku_id' => $bahanId,
                                    'name'          => $bb->name ?? null,
                                    'unit'          => $bahanResep->satuan,
                                    'quantity'      => $qtyUsed,
                                    'cost'          => (float) $cost,
                                ];
                            }
                        }

                        // ==========================
                        // NORMALIZED ROW
                        // ==========================
                        $row = [
                            'name'          => $baseKey,
                            'category'      => $categoryId,
                            'quantity'      => $quantity,
                            'base_price'    => $basePrice,
                            'variant_price' => $variantPricePerItem,
                            'total_price'   => ($basePrice + $variantPricePerItem) * $quantity,
                            'variants'      => $variantItems,
                            'used_ingredients' => $usedIngredients,
                        ];

                        // ==========================
                        // BUCKET + MERGE CEPAT (tanpa merge/groupBy collection berulang)
                        // ==========================
                        if (isset($foodSet[$categoryId])) {
                            $key = $baseKey;

                            if (!isset($transFood[$key])) {
                                $transFood[$key] = $row;
                                $transFood[$key]['_ing_map'] = []; // internal map
                            } else {
                                $transFood[$key]['quantity'] += $quantity;
                                $transFood[$key]['total_price'] += $row['total_price'];
                            }

                            // accumulate ingredients
                            foreach ($usedIngredients as $ing) {
                                $id = $ing['bahan_baku_id'];
                                if (!isset($transFood[$key]['_ing_map'][$id])) {
                                    $transFood[$key]['_ing_map'][$id] = $ing;
                                } else {
                                    $transFood[$key]['_ing_map'][$id]['quantity'] += $ing['quantity'];
                                    $transFood[$key]['_ing_map'][$id]['cost'] += $ing['cost'];
                                }
                            }
                        } elseif (isset($drinkSet[$categoryId])) {
                            $key = $drinkKey;
                            $row['menu'] = $key;

                            if (!isset($transDrink[$key])) {
                                $transDrink[$key] = $row;
                                $transDrink[$key]['_ing_map'] = [];
                            } else {
                                $transDrink[$key]['quantity'] += $quantity;
                                $transDrink[$key]['total_price'] += $row['total_price'];
                            }

                            foreach ($usedIngredients as $ing) {
                                $id = $ing['bahan_baku_id'];
                                if (!isset($transDrink[$key]['_ing_map'][$id])) {
                                    $transDrink[$key]['_ing_map'][$id] = $ing;
                                } else {
                                    $transDrink[$key]['_ing_map'][$id]['quantity'] += $ing['quantity'];
                                    $transDrink[$key]['_ing_map'][$id]['cost'] += $ing['cost'];
                                }
                            }
                        } else {
                            $transUnknown[] = $row;
                        }
                    }
                }
            });

        // ==========================
        // FINALIZE: convert _ing_map -> used_ingredients
        // ==========================
        foreach ($transFood as $k => $row) {
            $transFood[$k]['used_ingredients'] = array_values($row['_ing_map'] ?? []);
            unset($transFood[$k]['_ing_map']);
        }
        foreach ($transDrink as $k => $row) {
            $transDrink[$k]['used_ingredients'] = array_values($row['_ing_map'] ?? []);
            unset($transDrink[$k]['_ing_map']);
        }

        // ==========================
        // SUM BAHAN BAKU KESELURUHAN
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

                $sumIngredients[$id]['quantity'] += (float) $ingredient['quantity'];
                $sumIngredients[$id]['cost'] += (float) $ingredient['cost'];
            }
        }

        return [
            'transactions_food'  => array_values($transFood),
            'transactions_drink' => array_values($transDrink),
            'transactions_unknown' => array_values($transUnknown),
            'sum_ingredients'    => array_values($sumIngredients),
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
