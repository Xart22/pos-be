<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
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

        return Inertia::render('master-data/menu/index', [
            'menus' => $menus
        ]);
    }
}
