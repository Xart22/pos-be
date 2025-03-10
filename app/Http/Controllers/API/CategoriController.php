<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoriController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:categories'
            ]);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }
            $data = Category::create($request->except('_token'));
            return response()->json([
                'message' => 'Category created',
                'data' => $data

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
        $category = Category::find($id);
        return response()->json($category);
    }
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        $category->name = $request->name;
        $category->save();
        return response()->json($category);
    }
    public function destroy($id)
    {
        $category = Category::find($id);
        $category->delete();
        return response()->json($category);
    }
}
