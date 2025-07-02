<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CashDrawer;
use App\Models\Menu;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\TransactionDetailVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
                'order_id' => $request->input('transaction_id'),
                'user_id' => 1,
                'promo_id' => $request->input('promo_id', null), // optional
                'type' => $request->input('type'), // default to purchase
                'status' => $request->input('status', 'PROCESS'), // default to pending
                'table_number' => $request->input('table_number', null), // optional
                'customer_name' => $request->input('customer_name', null), // optional
                'payment_method' => $request->input('payment_method', 'CASH'),
                'cash' => $request->input('cash', 0), // default to 0
                'change' => $request->input('change', 0), // default to 0
                'discount' => $request->input('discount', 0), // default to 0
                'total_price' => $request->input('total'), // required
                'payment_proof' => $request->input('payment_proof', null), // optional
                'table_number' => $request->input('table_number', null), // optional
                'sub_total' => $request->input('sub_total', 0), // default to 0
            ];
            DB::beginTransaction();
            $transactions_id = Transaction::create($transactions)->id;


            $items = $request->input('items', []);

            foreach ($items as $item) {

                $transactions_detail_id = TransactionDetail::create([
                    'transaction_id' => $transactions_id,
                    'menu_id' => $item['menu_id'],
                    'quantity' => $item['quantity'],
                ])->id;
                Menu::where('id', $item['menu_id'])
                    ->decrement('stock', $item['quantity']);

                if (isset($item['options']) && is_array($item['options'])) {
                    foreach ($item['options'] as $option) {
                        TransactionDetailVariant::create([
                            'transaction_detail_id' => $transactions_detail_id,
                            'variant_id' => $option['variant_id'],
                            'variant_options_id' => $option['variant_option_id'],
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json([
                'message' => 'Transaction processed successfully',
                'data' => $request->all()
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to process transaction',
                'error' => $th->getMessage()
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
            'customer_name' => $transaction->customer_name,
            'table_number' => $transaction->table_number,
            'sub_total' => $transaction->sub_total,
            'discount' => $transaction->discount,
            'total' => $transaction->total_price,
            'payment_method' => $transaction->payment_method,
            'cash' => $transaction->cash,
            'change' => $transaction->change,


            'data' => $order,
        ];

        return response()->json([
            'message' => 'Transaction retrieved successfully',
            'data' => $data
        ]);
    }
}
