<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BahanBaku;
use App\Models\CashDrawer;
use App\Models\Menu;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\TransactionDetailVariant;
use App\Models\VariantOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionController extends Controller
{

    public function getOrderNumber()
    {
        $countToday = Transaction::whereDate('created_at', now())->count();
        $countToday = str_pad($countToday + 1, 3, '0', STR_PAD_LEFT);
        //format 250325-0001
        $todayDate = now()->format('dmy');
        $orderNumber = "S{$todayDate}-{$countToday}";
        return response()->json([
            'message' => 'Order number generated successfully',
            'order_number' => $orderNumber
        ]);
    }



    public function processTransaction(Request $request)
    {
        try {
            $transactions = [
                'order_id'       => $request->input('transaction_id'),
                'user_id'        => 1,
                'promo_id'       => $request->input('promo_id', null),
                'type'           => $request->input('type'),
                'status'         => $request->input('status', 'PROCESS'),
                'table_number'   => $request->input('table_number', null),
                'customer_name'  => $request->input('customer_name', null),
                'payment_method' => $request->input('payment_method', 'CASH'),
                'cash'           => $request->input('cash', 0),
                'change'         => $request->input('change', 0),
                'discount'       => $request->input('discount', 0),
                'total_price'    => $request->input('total'),
                'payment_proof'  => $request->input('payment_proof', null),
                'sub_total'      => $request->input('sub_total', 0),
            ];

            $items = $request->input('items', []);

            DB::beginTransaction();

            // ==========================
            // 1. SIMPAN TRANSAKSI
            // ==========================
            $transactionId = Transaction::create($transactions)->id;

            // ==========================
            // 2. PRELOAD MENU & VARIANT OPTION (HEMAT QUERY)
            // ==========================
            $menuIds = collect($items)->pluck('menu_id')->unique()->values();

            $menus = Menu::with([
                'recipes.bahanBakus.bahanBaku', // recipe + bahan baku
            ])->whereIn('id', $menuIds)->get()->keyBy('id');

            $variantOptionIds = collect($items)
                ->flatMap(function ($item) {
                    return collect($item['options'] ?? [])->pluck('variant_option_id');
                })
                ->filter()
                ->unique()
                ->values();

            $variantOptions = VariantOption::whereIn('id', $variantOptionIds)
                ->get()
                ->keyBy('id');

            // ==========================
            // 3. LOOP ITEM TRANSAKSI
            // ==========================
            foreach ($items as $item) {
                $quantity = (int) ($item['quantity'] ?? 0);
                $menuId   = $item['menu_id'];

                // Simpan detail
                $transactionDetail = TransactionDetail::create([
                    'transaction_id' => $transactionId,
                    'menu_id'        => $menuId,
                    'quantity'       => $quantity,
                ]);

                // Kurangi stok MENU (stok display)
                Menu::where('id', $menuId)->decrement('stock', $quantity);

                // Simpan varian yang dipilih
                $options = $item['options'] ?? [];
                foreach ($options as $option) {
                    TransactionDetailVariant::create([
                        'transaction_detail_id' => $transactionDetail->id,
                        'variant_id'            => $option['variant_id'],
                        'variant_options_id'    => $option['variant_option_id'],
                    ]);
                }

                // ==================================
                // 4. KURANGI STOK BAHAN BAKU (INTI)
                // ==================================
                $menu = $menus->get($menuId);
                if (!$menu || $quantity <= 0) {
                    continue;
                }

                // Ambil nama-nama variant option yang dipilih
                $selectedOptionNames = collect($options)
                    ->map(function ($opt) use ($variantOptions) {
                        $vo = $variantOptions->get($opt['variant_option_id'] ?? null);
                        return $vo ? $vo->name : null;
                    })
                    ->filter()
                    ->map(fn($name) => Str::lower($name))
                    ->values();

                // Pilih recipe sesuai aturan (mirip di controller laporanmu)
                $recipe = null;

                if ($selectedOptionNames->contains(fn($n) => Str::contains($n, 'large'))) {
                    // Recipe untuk Large (misal yang punya variant_options_id != null)
                    $recipe = $menu->recipes->firstWhere('variant_options_id', '!=', null);
                } elseif ($selectedOptionNames->contains(fn($n) => Str::contains($n, 'reguler'))) {
                    // Recipe reguler = recipe pertama
                    $recipe = $menu->recipes->first();
                } else {
                    // Default: pakai recipe pertama saja
                    $recipe = $menu->recipes->first();
                }

                if (!$recipe) {
                    continue; // kalau belum ada recipe, jangan kurangi stok
                }

                // Loop bahan di recipe tersebut dan kurangi stok
                foreach ($recipe->bahanBakus as $bahanResep) {
                    $bahanBakuId = $bahanResep->bahan_baku_id;
                    $jumlahPerCup = (float) $bahanResep->jumlah; // misal 20 Gram per cup
                    $totalDipakai = $jumlahPerCup * $quantity;

                    // Kurangi stok di tabel bahan baku
                    BahanBaku::where('id', $bahanBakuId)
                        ->decrement('stock', $totalDipakai);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Transaction processed successfully',
                'data'    => $request->all(),
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to process transaction',
                'error'   => $th->getMessage(),
            ], 500);
        }
    }

    public function getTodayTransactions()
    {
        // Rentang waktu dalam WIB
        $start = now('Asia/Jakarta')->startOfDay();
        $end = now('Asia/Jakarta')->endOfDay();

        $transactions = Transaction::whereBetween('created_at', [$start, $end])
            ->with(['user', 'details'])
            ->get();

        $cashDrawer = CashDrawer::whereBetween('created_at', [$start, $end])->first();

        return response()->json([
            'message' => 'Today transactions retrieved successfully',

            'data' => $transactions,
            'cash_drawer' => $cashDrawer ? $cashDrawer->opening_balance : 0
        ]);
    }

    public function getTransactionsById($id)
    {
        $transaction = Transaction::with([
            'details.menu',
            'details.variants.variantOption.variant'
        ])->where('id', $id)->first();


        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction not found'
            ], 404);
        }

        $order = [];
        foreach ($transaction->details as $detail) {
            $order[] = [
                'menu' => $detail->menu->name,
                'category' => $detail->menu->category->id,
                'quantity' => $detail->quantity,
                'base_price' => $detail->menu->price,
                'variant_price' => $detail->variants->sum('variantOption.price'),
                'total_price' => $detail->menu->price * $detail->quantity + $detail->variants->sum('variantOption.price'),

                'variants' => $detail->variants->map(function ($variant) {
                    return [
                        'variant_name' => $variant->variantOption->variant->name,
                        'name' => $variant->variantOption->name,
                        'price' => $variant->variantOption->price
                    ];
                }),
            ];
        }
        $data = [
            'order_number' => $transaction->order_id,
            'order_date' => $transaction->created_at->format('Y-m-d H:i:s'),
            'type' => $transaction->type,
            'customer_name' => $transaction->customer_name,
            'table_number' => $transaction->table_number,
            'sub_total' => $transaction->sub_total,
            'discount' => $transaction->discount,
            'total' => $transaction->total_price,
            'payment_method' => $transaction->payment_method,
            'cash' => $transaction->cash,
            'change' => $transaction->change,
            'payment_proof' => $transaction->payment_proof,
            'data' => $order,
        ];

        return response()->json([
            'message' => 'Transaction retrieved successfully',
            'data' => $data
        ]);
    }
}
