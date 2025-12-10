<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BahanBakuController extends Controller
{
    public function index()
    {
        $bahanBaku = BahanBaku::all()->map(function ($bahan) {
            // default
            $bahan->total = 0;

            if ($bahan->per_unit == 0 || $bahan->stock <= 0) {
                return $bahan;
            }

            $unitPrice = $bahan->harga / $bahan->per_unit; // harga per 1 satuan
            $bahan->total = $unitPrice * $bahan->stock;

            return $bahan;
        });


        return Inertia::render('master-data/bahan-baku/index', [
            'bahanBakus' => $bahanBaku,

        ]);
    }

    public function create()
    {
        // Menampilkan formulir untuk menambahkan bahan baku baru
    }

    public function store(Request $request)
    {

        BahanBaku::create($request->all());
        return redirect()->route('bahan-baku.index')->with('success', 'Bahan baku berhasil ditambahkan.');
    }

    public function show($id)
    {
        // Menampilkan rincian bahan baku berdasarkan ID
    }


    public function edit($id)
    {
        // Menampilkan formulir untuk mengedit bahan baku yang ada
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('bahan-baku.index')->with('error', 'Anda tidak memiliki izin untuk memperbarui bahan baku.');
        }
        $bahanBaku = BahanBaku::where('kode', $id)->firstOrFail();
        $bahanBaku->update($request->all());
        return redirect()->route('bahan-baku.index')->with('success', 'Bahan baku berhasil diperbarui.');
    }

    public function destroy($id)
    {
        // Menghapus bahan baku berdasarkan ID
        $bahanBaku = BahanBaku::where('kode', $id)->firstOrFail();
        $bahanBaku->delete();
        return redirect()->route('bahan-baku.index')->with('success', 'Bahan baku berhasil dihapus.');
    }
}
