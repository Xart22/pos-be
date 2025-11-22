<?php

namespace App\Http\Controllers;

use App\Models\Bahan;
use App\Models\BahanBaku;
use App\Models\Menu;
use App\Models\Recipe;
use App\Models\VariantOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RecipeController extends Controller
{
    public function index()
    {
        $recipes = Recipe::with(['bahanBakus', 'menu', 'variantOption'])->get();
        $bahanBakus = BahanBaku::all();
        $variantOptions = VariantOption::where("price", ">", 0)->get();


        $menus = Menu::all();

        // Logic to retrieve and display recipes
        return Inertia::render('master-data/recipes/index', [
            'recipes' => $recipes,
            'bahanBaku' => $bahanBakus,
            'menus' => $menus,
            'variantOptions' => $variantOptions,
        ]);
    }

    public function create()
    {
        // Logic to show form for creating a new recipe
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'menu_id' => 'required|exists:menus,id',
                'rows' => 'required|array|min:1',
                'rows.*.ingredien_id' => 'required|exists:bahan_bakus,id',
                'rows.*.quantity' => 'required|numeric|min:0',
                'rows.*.unit' => 'required|string',
                'instruction' => 'nullable|string',
                'variant_id' => 'nullable|exists:variant_options,id',
            ]);
            DB::beginTransaction();
            $recipe = Recipe::create([
                'menu_id' => $data['menu_id'],
                'instructions' => $data['instruction'] ?? '',
                'variant_options_id' => $data['variant_id'] ?? null,
            ]);

            foreach ($data['rows'] as $row) {
                Bahan::create([
                    'recipe_id' => $recipe->id,
                    'bahan_baku_id' => $row['ingredien_id'],
                    'jumlah' => $row['quantity'],
                    'satuan' => $row['unit'],
                ]);
            }
            DB::commit();
            return redirect()->route('recipes.index')->with('success', 'Recipe created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('recipes.index')->with('error', 'Failed to create recipe: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        // Logic to show a specific recipe
    }

    public function edit($id)
    {
        // Logic to show form for editing a recipe
    }

    public function update(Request $request, $id)
    {
        // Logic to update a recipe
        $data = $request->validate([
            'rows' => 'required|array|min:1',
            'rows.*.ingredien_id' => 'required|exists:bahan_bakus,id',
            'rows.*.quantity' => 'required|numeric|min:0',
            'rows.*.unit' => 'required|string',
            'instruction' => 'nullable|string',
            'variant_id' => 'nullable|exists:variant_options,id',
        ]);

        try {
            DB::beginTransaction();
            $recipe = Recipe::findOrFail($id);
            $recipe->update([
                'instructions' => $data['instruction'] ?? '',
                'variant_options_id' => $data['variant_id'] ?? null,
            ]);
            // Hapus bahan lama
            Bahan::where('recipe_id', $recipe->id)->delete();
            // Tambah bahan baru
            foreach ($data['rows'] as $row) {
                Bahan::create([
                    'recipe_id' => $recipe->id,
                    'bahan_baku_id' => $row['ingredien_id'],
                    'jumlah' => $row['quantity'],
                    'satuan' => $row['unit'],
                ]);
            }
            DB::commit();
            return redirect()->route('recipes.index')->with('success', 'Recipe updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('recipes.index')->with('error', 'Failed to update recipe: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        // Logic to delete a recipe
    }
}
