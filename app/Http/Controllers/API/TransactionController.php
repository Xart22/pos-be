<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BahanBaku;
use App\Models\CashDrawer;
use App\Models\Menu;
use App\Models\PoolPrintKitchen;
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

            $items        = $request->input('items', []);
            $foodCategory = [2, 3, 4, 5, 6, 7, 8, 9, 18];
            $discountAmount = (float) $request->input('discount', 0);
            $totalAmount = (float) $request->input('total', 0);
            $isFullDiscount = $totalAmount > 0 && abs($discountAmount - $totalAmount) < 0.01;

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
                'recipes.bahanBakus.bahanBaku',
            ])->whereIn('id', $menuIds)->get()->keyBy('id');

            $variantOptionIds = collect($items)
                ->flatMap(fn($item) => collect($item['options'] ?? [])->pluck('variant_option_id'))
                ->filter()
                ->unique()
                ->values();

            $variantOptions = VariantOption::whereIn('id', $variantOptionIds)
                ->get()
                ->keyBy('id');

            // ==========================
            // 3. LOOP ITEM TRANSAKSI
            // ==========================
            $hasFoodItem = false;  // flag: apakah ada item kategori makanan

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

                // Cek apakah menu ini masuk kategori makanan
                $menu = $menus->get($menuId);
                if ($menu && in_array($menu->category_id, $foodCategory)) {
                    $hasFoodItem = true;
                }

                // ==================================
                // 4. KURANGI STOK BAHAN BAKU (INTI)
                // ==================================
                if (!$menu || $quantity <= 0) {
                    continue;
                }

                $selectedOptionNames = collect($options)
                    ->map(fn($opt) => optional($variantOptions->get($opt['variant_option_id'] ?? null))->name)
                    ->filter()
                    ->map(fn($name) => Str::lower($name))
                    ->values();

                $recipe = null;

                if ($selectedOptionNames->contains(fn($n) => Str::contains($n, 'large'))) {
                    $recipe = $menu->recipes->firstWhere('variant_options_id', '!=', null);
                } elseif ($selectedOptionNames->contains(fn($n) => Str::contains($n, 'reguler'))) {
                    $recipe = $menu->recipes->first();
                } else {
                    $recipe = $menu->recipes->first();
                }

                if (!$recipe) continue;
                $redeemNotAllowed = [4, 11, 10];
                foreach ($recipe->bahanBakus as $bahanResep) {
                    if ($isFullDiscount && in_array($bahanResep->bahan_baku_id, $redeemNotAllowed)) {
                        continue;
                    }
                    BahanBaku::where('id', $bahanResep->bahan_baku_id)
                        ->decrement('stock', (float) $bahanResep->jumlah * $quantity);
                }
            }

            // ==========================
            // 5. INSERT KE POOL KITCHEN
            // Hanya jika ada minimal 1 item kategori makanan
            // ==========================
            if ($hasFoodItem) {
                PoolPrintKitchen::create([
                    'transaction_id' => $transactionId,
                    'printed'        => false,
                ]);
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
