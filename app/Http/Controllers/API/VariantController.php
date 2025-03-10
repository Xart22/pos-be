<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VariantController extends Controller
{
    public function index()
    {
        $variants = Variant::all();
        return response()->json($variants);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:variants',
                'options' => 'required|array|min:2'
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }
            $data = Variant::create($request->except('_token', 'options'));
            $data->options()->createMany($request->options);
            return response()->json([
                'message' => 'Variant created',

            ]);
        } catch (\Exception $e) {
            if (str_contains($e->getMessage(), 'Integrity constraint violation: 1062 Duplicate entry')) {
                return response()->json([
                    'message' => 'Data already exists'
                ], 400);
            }
            return response()->json($e->getMessage(), 500);
        }
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
