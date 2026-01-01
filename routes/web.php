<?php

use App\Http\Controllers\BahanBakuController;
use App\Http\Controllers\CashInController;
use App\Http\Controllers\CashOutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OperationalController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StockOpnameController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::post('cashbon/request', [DashboardController::class, 'handleSubmitCashbon'])
        ->name('cashbon.request');


    Route::get('master-data/menu', [MenuController::class, 'index'])
        ->name('menu.index');


    Route::post('dashboard/absensi', [DashboardController::class, 'handleSubmit'])
        ->name('dashboard.absensi.submit');

    Route::get('/master-data/recipes', [RecipeController::class, 'index'])
        ->name('recipes.index');
});

Route::middleware(['auth', 'verified',])->group(function () {

    Route::get('/master-data/bahan-baku', [BahanBakuController::class, 'index'])
        ->name('bahan-baku.index');

    Route::post('/master-data/bahan-baku', [BahanBakuController::class, 'store'])
        ->name('bahan-baku.store');

    Route::put('/master-data/bahan-baku/{kode}', [BahanBakuController::class, 'update'])
        ->name('bahan-baku.update');

    Route::delete('/master-data/bahan-baku/{kode}', [BahanBakuController::class, 'destroy'])
        ->name('bahan-baku.destroy');

    Route::post('/master-data/recipes', [RecipeController::class, 'store'])
        ->name('recipes.store');


    Route::put('/master-data/recipes/{id}', [RecipeController::class, 'update'])
        ->name('recipes.update');

    Route::get('/cash-flow/cash-in', [CashInController::class, 'index'])
        ->name('cash-in.index');

    Route::get('/cash-flow/cash-out', [CashOutController::class, 'index'])
        ->name('cash-out.index');

    Route::post('/cash-flow/cash-out', [CashOutController::class, 'store'])
        ->name('cash-out.store');

    Route::get('/cash-flow/operational', [OperationalController::class, 'index'])
        ->name('operational.index');


    Route::get('/stock-opname/{start?}/{end?}', [StockOpnameController::class, 'index'])
        ->name('stock-opname.index');


    Route::get('/report/{start?}/{end?}', [ReportController::class, 'index'])
        ->name('report.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
