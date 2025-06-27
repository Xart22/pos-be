<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $menu = Menu::all();

        return response()->json([
            'message' => 'Menu retrieved successfully',
            'menu' => $menu
        ]);
    }


    public function store(Request $request)
    {
        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/images/menu', $filename);
                $dbPath = str_replace('public/', 'storage/', $path);
                $request->merge(['image' => $dbPath]);
            }

            DB::beginTransaction();
            $data = Menu::create([
                'category_id' => $request->input('category_id'),
                'name' => $request->input('name'),
                'price' => $request->input('price'),
                'description' => $request->input('description'),
                'image' => $request->input('image'),
                'image_local' => $request->input('image_local'),
                'stock' => $request->input('stock', 0),
                'is_active' => $request->input('is_active', true),
                'is_online' => $request->input('is_online', false),
            ]);
            if ($request->hasFile('image')) {
                $data->image = $request->input('image');
            }
            if ($request->variants != null) {
                $variants = json_decode($request->variants, true);
                foreach ($variants as $variant) {
                    MenuOption::create([
                        'menu_id' => $data->id,
                        'variant_id' => $variant['id'],
                        'position' => $variant['position'],
                    ]);
                }
            }
            DB::commit();

            return response()->json([
                'message' => 'Menu created',
                'menu' => $data
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            if ($request->hasFile('image')) {
                Storage::disk('local')->delete($request->input('image'));
            }
            return response()->json($e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('public/images/menu', $filename);
                $dbPath = str_replace('public/', 'storage/', $path);
                $request->merge(['image' => $dbPath]);
            }

            DB::beginTransaction();
            $menu = Menu::findOrFail($id);

            $menu->update([
                'category_id' => $request->input('category_id'),
                'name' => $request->input('name'),
                'price' => $request->input('price'),
                'description' => $request->input('description'),
                'image' => $request->input('image', $menu->image),
                'image_local' => $request->image_local ?? $menu->image_local,
                'stock' => $request->input('stock', 0),
                'is_active' => $request->input('is_active', true),
                'is_online' => $request->input('is_online', false),
            ]);




            if ($request->variants != null) {
                MenuOption::where('menu_id', $menu->id)->delete();
                $variants = json_decode($request->variants, true);
                foreach ($variants as $variant) {
                    MenuOption::create([
                        'menu_id' => $menu->id,
                        'variant_id' => $variant['id'],
                        'position' => $variant['position'],
                    ]);
                }
            }
            DB::commit();
            $menu->save();
            return response()->json([
                'message' => 'Menu updated',
                'menu' => $menu
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            if ($request->hasFile('image')) {
                Storage::disk('local')->delete($request->input('image'));
            }
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
