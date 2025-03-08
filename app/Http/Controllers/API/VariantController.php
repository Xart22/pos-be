<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Variant;
use Illuminate\Http\Request;

class VariantController extends Controller
{
    public function index()
    {
        $variants = Variant::all();
        return response()->json($variants);
    }

    public function store(Request $request)
    {
        $variant = new Variant();
        $variant->name = $request->name;
        $variant->save();
        return response()->json($variant);
    }

    public function show($id)
    {
        $variant = Variant::find($id);
        return response()->json($variant);
    }

    public function update(Request $request, $id)
    {
        $variant = Variant::find($id);
        $variant->name = $request->name;
        $variant->save();
        return response()->json($variant);
    }

    public function destroy($id)
    {
        $variant = Variant::find($id);
        $variant->delete();
        return response()->json($variant);
    }
}
