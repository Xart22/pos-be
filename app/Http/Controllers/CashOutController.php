<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\CashOut;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CashOutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bahanBaku = BahanBaku::all();
        return Inertia::render('cash-flow/cash-out/page', [
            'bahanBaku' => $bahanBaku,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $desc = $request->description ?? '';
            foreach ($request->rows as $item) {
                if ($item['bahan_baku_id'] != 78) {
                    $bahanBaku = BahanBaku::where('id', $item['bahan_baku_id'])->first();
                    if ($bahanBaku) {
                        $bahanBaku->stock += $item['quantity'];
                        $bahanBaku->harga = $item['harga'];
                        $bahanBaku->save();
                        $desc .= " \n Pembelian - {$bahanBaku->name}: +{$item['quantity']} total = {$bahanBaku->stock} @ Rp. " . number_format($item['harga'], 0, ',', '.');
                    }
                }
            }

            CashOut::create([
                'amount' => $request->total,
                'description' => trim($desc),
                'tanggal' => $request->tanggal,
            ]);

            DB::commit();
            return redirect()->route('cash-out.index')->with('success', 'Cash out processed successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->with('error', 'An error occurred: ' . $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
