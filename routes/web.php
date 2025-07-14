<?php

use App\Http\Controllers\BahanBakuController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RecipeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');


    Route::get('master-data/menu', [MenuController::class, 'index'])
        ->name('menu.index');


    Route::post('dashboard/absensi', [DashboardController::class, 'handleSubmit'])
        ->name('dashboard.absensi.submit');

    Route::get('/master-data/bahan-baku', [BahanBakuController::class, 'index'])
        ->name('bahan-baku.index');

    Route::get('/master-data/recipes', [RecipeController::class, 'index'])
        ->name('recipes.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
