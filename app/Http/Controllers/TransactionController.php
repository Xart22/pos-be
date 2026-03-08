<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\CashDrawer;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function getTransactions($date = null)
    {
        $date = $date ?? now()->format('Y-m-d');

        // Rentang waktu dalam WIB
        $start = Carbon::parse($date, 'Asia/Jakarta')->startOfDay();
        $end = Carbon::parse($date, 'Asia/Jakarta')->endOfDay();

        $transactions = Transaction::whereBetween('created_at', [$start, $end])
            ->with(['user', 'details.menu'])
            ->orderBy('created_at', 'desc')
            ->get();

        $cashDrawer = CashDrawer::whereBetween('created_at', [$start, $end])->first();

        return Inertia::render('transactions/page', [
            'transactions' => $transactions,
            'cashDrawer' => $cashDrawer,
            'selectedDate' => $date,
        ]);
    }

    public function getTransactionsById($id)
    {
        $transaction = Transaction::with([
            'details.menu.category',
            'details.variants.variantOption.variant'
        ])->where('id', $id)->first();

        if (!$transaction) {
            return redirect()->route('transactions.index')
                ->with('error', 'Transaksi tidak ditemukan');
        }

        $order = [];
        foreach ($transaction->details as $detail) {
            $variantPrice = $detail->variants->sum('variantOption.price');
            $itemTotal = ($detail->menu->price + $variantPrice) * $detail->quantity;

            $order[] = [
                'menu' => $detail->menu->name,
                'category' => $detail->menu->category->id ?? null,
                'quantity' => $detail->quantity,
                'base_price' => $detail->menu->price,
                'variant_price' => $variantPrice,
                'total_price' => $itemTotal,
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

        return Inertia::render('transactions/show', [
            'transaction' => $data,
        ]);
    }
}
