<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BahanBaku;
use Illuminate\Http\Request;

class BahanBakuController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'List of Bahan Baku',
            'data' => BahanBaku::all()
        ]);
    }

    public function show($id)
    {
        $bahanBaku = BahanBaku::find($id);
        if (!$bahanBaku) {
            return response()->json(['message' => 'Bahan Baku not found'], 404);
        }

        return response()->json([
            'message' => 'Detail Bahan Baku',
            'data' => $bahanBaku
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'kode' => 'required|string|max:50|unique:bahan_bakus,kode',
            'name' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'stock' => 'required|integer',
            'satuan' => 'required|string|max:50',
            'deskripsi' => 'nullable|string',
        ]);

        $bahanBaku = BahanBaku::create($validatedData);

        return response()->json([
            'message' => 'Bahan Baku created successfully',
            'data' => $bahanBaku
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $bahanBaku = BahanBaku::find($id);
        if (!$bahanBaku) {
            return response()->json(['message' => 'Bahan Baku not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'harga' => 'sometimes|required|numeric',
            'stok' => 'sometimes|required|integer',
            'satuan' => 'nullable|string|max:50',
            'deskripsi' => 'nullable|string',
        ]);

        $bahanBaku->update($validatedData);

        return response()->json([
            'message' => 'Bahan Baku updated successfully',
            'data' => $bahanBaku
        ]);
    }

    public function destroy($id)
    {
        $bahanBaku = BahanBaku::find($id);
        if (!$bahanBaku) {
            return response()->json(['message' => 'Bahan Baku not found'], 404);
        }

        $bahanBaku->delete();

        return response()->json(['message' => 'Bahan Baku deleted successfully']);
    }
}
