<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Container\Attributes\Storage;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $menu = Menu::all();

        return response()->json($menu);
    }


    public function store(Request $request)
    {
        try {
            //store image
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/images', $filename);
                $request->merge(['image' => 'storage/images/' . $filename]);
            }
            $data = Menu::create($request->except('_token'));
            return response()->json([
                'message' => 'Menu created',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $menu = Menu::findOrFail($id);
            $menu->update($request->except('_token'));
            return response()->json([
                'message' => 'Menu updated',
                'data' => $menu
            ]);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }


    public function destroy($id)
    {
        try {
            $menu = Menu::findOrFail($id);
            $menu->delete();
            return response()->json([
                'message' => 'Menu deleted',
                'data' => $menu
            ]);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $menu = Menu::findOrFail($id);
            return response()->json($menu);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }
}
