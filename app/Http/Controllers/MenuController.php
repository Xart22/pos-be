<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::with('category')
            ->join('categories', 'menus.category_id', '=', 'categories.id')
            ->orderBy('categories.name')
            ->orderBy('menus.name') // opsional: sort nama menu dalam kategori
            ->select('menus.*') // hindari konflik kolom
            ->get();

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('master-data/menu/index', [
            'menus' => $menus,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255|unique:menus,name',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
            'is_online' => 'required|boolean',
            'image' => 'nullable|string|max:2048',
            'image_file' => 'nullable|image|max:5120',
        ]);

        try {
            DB::beginTransaction();

            $imagePath = $validated['image'] ?? '';
            if ($request->hasFile('image_file')) {
                $path = $request->file('image_file')->store('images/menu', 'public');
                $imagePath = 'storage/' . $path;
            }

            Menu::create([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'price' => $validated['price'],
                'description' => $validated['description'],
                'image' => $imagePath,
                'image_local' => $imagePath,
                'stock' => $validated['stock'],
                'is_active' => $validated['is_active'],
                'is_online' => $validated['is_online'],
            ]);

            DB::commit();

            return redirect()->route('menu.index')->with('success', 'Menu berhasil ditambahkan.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->route('menu.index')->with('error', $th->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        if (Auth::user()?->role !== 'admin') {
            return redirect()->route('menu.index')->with('error', 'Anda tidak memiliki izin untuk memperbarui menu.');
        }

        $menu = Menu::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255|unique:menus,name,' . $menu->id,
            'price' => 'required|numeric|min:0',
            'description' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
            'is_online' => 'required|boolean',
            'image' => 'nullable|string|max:2048',
            'image_file' => 'nullable|image|max:5120',
        ]);

        try {
            DB::beginTransaction();

            $imagePath = $validated['image'] ?? $menu->image;
            if ($request->hasFile('image_file')) {
                $path = $request->file('image_file')->store('images/menu', 'public');
                $imagePath = 'storage/' . $path;
            }

            $menu->update([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'price' => $validated['price'],
                'description' => $validated['description'],
                'image' => $imagePath,
                'image_local' => $imagePath,
                'stock' => $validated['stock'],
                'is_active' => $validated['is_active'],
                'is_online' => $validated['is_online'],
            ]);

            DB::commit();

            return redirect()->route('menu.index')->with('success', 'Menu berhasil diperbarui.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return redirect()->route('menu.index')->with('error', $th->getMessage());
        }
    }

    public function destroy($id)
    {
        if (Auth::user()?->role !== 'admin') {
            return redirect()->route('menu.index')->with('error', 'Anda tidak memiliki izin untuk menghapus menu.');
        }

        $menu = Menu::findOrFail($id);
        $menu->delete();

        return redirect()->route('menu.index')->with('success', 'Menu berhasil dihapus.');
    }
}
