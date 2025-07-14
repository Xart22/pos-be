<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BahanBakuController extends Controller
{
    public function index()
    {
        $bahanBaku = BahanBaku::all();
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
        // Menyimpan bahan baku baru ke dalam database
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
        // Memperbarui bahan baku yang ada di dalam database
    }

    public function destroy($id)
    {
        // Menghapus bahan baku dari database
    }
}
