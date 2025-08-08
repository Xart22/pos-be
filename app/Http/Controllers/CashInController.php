<?php

namespace App\Http\Controllers;

use App\Models\CashIn;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashInController extends Controller
{
    public function index()
    {
        $cashIns = CashIn::all();
        return Inertia::render('cash-flow/cash-in/page', [
            'cashIns' => $cashIns,
        ]);
    }
}
