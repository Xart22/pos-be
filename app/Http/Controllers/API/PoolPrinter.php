<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PoolPrintKitchen;
use Illuminate\Http\Request;

class PoolPrinter extends Controller
{
    public function index()
    {
        $pool = PoolPrintKitchen::where('printed', false)
            ->with(['transaction.details.menu', 'transaction.details.variants.variantOption'])
            ->first();

        // Kalau tidak ada antrian, return 204 No Content
        // ESP32 sudah handle 204 dengan benar
        if (!$pool || !$pool->transaction) {
            return response()->json([
                'message' => 'No pending orders',
                'data'    => null
            ], 204);
        }

        $foodCategory = [2, 3, 4, 5, 6, 7, 8, 9, 18];
        $order = [];

        foreach ($pool->transaction->details as $detail) {
            // Skip kalau menu tidak ada
            if (!$detail->menu) continue;

            // Skip kalau bukan kategori makanan
            if (!in_array($detail->menu->category_id, $foodCategory)) continue;

            if ($detail->variants->isEmpty()) {
                $order[] = $detail->quantity . 'x ' . $detail->menu->name;
            } else {
                $variantNames = $detail->variants
                    ->map(fn($v) => $v->variantOption?->name)
                    ->filter()        // buang null
                    ->implode(', ');

                $order[] = $detail->quantity . 'x ' . $detail->menu->name . ' - ' . $variantNames;
            }
        }

        $temp = [
            'id'            => $pool->id,
            'order_number'  => $pool->transaction->order_id,
            'order_date'    => $pool->transaction->created_at->format('Y-m-d H:i:s'),
            'type'          => $pool->transaction->type,
            'customer_name' => $pool->transaction->customer_name,
            'table_number'  => $pool->transaction->table_number,
            'data'          => $order,
        ];

        return response()->json([
            'message' => 'Pool print kitchen retrieved successfully',
            'data'    => $temp,
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
