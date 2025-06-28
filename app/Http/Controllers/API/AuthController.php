<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CashDrawer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'nip' => 'required',
            'password' => 'required',
        ]);


        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Success',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function me()
    {
        return response()->json([
            'message' => 'Success',
            'user' => Auth::user()
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json([
            'message' => 'Logged out'
        ]);
    }


    public function startOpenCashDrawer(Request $request)
    {
        $start = now('Asia/Jakarta')->startOfDay()->timezone('UTC');
        $end = now('Asia/Jakarta')->endOfDay()->timezone('UTC');
        $cashDrawer = CashDrawer::whereBetween('created_at', [$start, $end])->first();

        return response()->json([
            'message' => 'Cash drawer already opened for today',
            'cash_drawer' => $cashDrawer->opening_balance ?? 0
        ]);
    }

    public function updateOpenCashDrawer(Request $request)
    {
        $cashDrawer = CashDrawer::create([
            'opening_balance' => $request->opening_balance,
        ]);

        return response()->json([
            'message' => 'Cash drawer opened successfully',
            'cash_drawer' => $cashDrawer->opening_balance
        ]);
    }
}
