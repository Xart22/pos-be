<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenuController;
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
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
