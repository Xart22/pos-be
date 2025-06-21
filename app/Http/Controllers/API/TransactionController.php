<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{

    public function getOrderNumber()
    {
        $countToday = Transaction::whereDate('created_at', now())->count();
        $countToday = str_pad($countToday + 1, 4, '0', STR_PAD_LEFT);
        $orderNumber = 'ORD-' . strtoupper(uniqid()) . '-' . $countToday;

        return response()->json([
            'message' => 'Order number generated successfully',
            'order_number' => $orderNumber
        ]);
    }

    public function processTransaction(Request $request)
    {

        Transaction::create([
            'invoice' => $request->input('order_number'),
            'amount' => $request->input('amount'),
            'status' => $request->input('status', 'pending'),
            'user_id' => $request->input('user_id'),
        ]);

        return response()->json([
            'message' => 'Transaction processed successfully',
            'data' => $request->all()
        ]);
    }
}
