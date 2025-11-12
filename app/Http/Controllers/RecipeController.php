<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\Menu;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecipeController extends Controller
{
    public function index()
    {
        $recipes = Recipe::with(['bahanBakus', 'menu'])->get();
        $bahanBakus = BahanBaku::all();

        $menus = Menu::whereNotIn('id', function ($query) {
            $query->select('menu_id')->from('recipes');
        })->get();

        // Logic to retrieve and display recipes
        return Inertia::render('master-data/recipes/index', [
            'recipes' => $recipes,
            'bahanBaku' => $bahanBakus,
            'menus' => $menus,
        ]);
    }

    public function create()
    {
        // Logic to show form for creating a new recipe
    }

    public function store(Request $request)
    {
        // Logic to store a new recipe
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
        // Logic to update an existing recipe
    }

    public function destroy($id)
    {
        // Logic to delete a recipe
    }
}
