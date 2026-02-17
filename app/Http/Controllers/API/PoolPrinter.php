<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PoolPrintKitchen;
use Illuminate\Http\Request;

class PoolPrinter extends Controller
{
    public function index()
    {
        $pool = PoolPrintKitchen::where('printed', false)->with('transaction')->first();
        $foodCategory = [2, 3, 4, 5, 6, 7, 8, 9, 18];
        $order = [];
        foreach ($pool->transaction->details as $detail) {
            if (!in_array($detail->menu->category_id, $foodCategory)) {
                continue;
            }

            if ($detail->variants->isEmpty()) {
                $order[] = $detail->quantity . 'x ' . $detail->menu->name;
                continue;
            } else {
                $order[] = $detail->quantity . 'x ' . $detail->menu->name . ' - ' . $detail->variants->map(function ($variant) {
                    return $variant->variantOption->name;
                })->implode(', ');
            }
        }

        $temp = [
            "id" => $pool->id,
            "order_number" => $pool->transaction->order_id,
            "order_date" => $pool->transaction->created_at->format('Y-m-d H:i:s'),
            "type" => $pool->transaction->type,
            "customer_name" => $pool->transaction->customer_name,
            "table_number" => $pool->transaction->table_number,
            "data" => $order
        ];
        return response()->json([
            'message' => 'Pool print kitchen retrieved successfully',
            'data' => $temp
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = PoolPrintKitchen::findOrFail($id);
        $data->printed = true;
        $data->save();

        return response()->json(['message' => 'Pool print kitchen updated successfully']);
    }
}
