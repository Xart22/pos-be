<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoriController;
use App\Http\Controllers\API\MenuController;
use App\Http\Controllers\API\SettingsController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\VariantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/login', [AuthController::class, 'login']);

// Route::middleware('auth:sanctum')->group(function () {

Route::get('/me', [AuthController::class, 'me']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::prefix('/categories')->group(function () {
    Route::get('/', [CategoriController::class, 'index']);
    Route::post('/store', [CategoriController::class, 'store']);
    Route::post('/update/{id}', [CategoriController::class, 'update']);
    Route::delete('/delete/{id}', [CategoriController::class, 'destroy']);
});

Route::prefix('/variants')->group(function () {
    Route::get('/', [VariantController::class, 'index']);
    Route::post('/store', [VariantController::class, 'store']);
    Route::post('/update/{id}', [VariantController::class, 'update']);
    Route::delete('/delete/{id}', [VariantController::class, 'destroy']);
});


Route::prefix('/menu')->group(function () {
    Route::get('/', [MenuController::class, 'index']);
    Route::post('/store', [MenuController::class, 'store']);
    Route::post('/update/{id}', [MenuController::class, 'update']);
});

Route::prefix('/settings')->group(function () {
    Route::get('/', [SettingsController::class, 'index']);
    Route::post('/', [SettingsController::class, 'store']);
    Route::put('/', [SettingsController::class, 'update']);
    Route::delete('/delete/{id}', [SettingsController::class, 'destroy']);
});


Route::prefix('/transactions')->group(function () {
    Route::get('/order-number', [TransactionController::class, 'getOrderNumber']);
    Route::post('/process', [TransactionController::class, 'processTransaction']);
    Route::get('/get-trasactions-today', [TransactionController::class, 'getTodayTransactions']);
});
// });
