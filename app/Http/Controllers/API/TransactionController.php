<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TransactionController extends Controller
{

    public function processTransaction(Request $request)
    {
        return response()->json([
            'message' => 'Transaction processed successfully',
            'data' => $request->all()
        ]);
    }
}
