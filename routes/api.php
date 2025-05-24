<?php

use App\Http\Controllers\API\CategoriController;
use App\Http\Controllers\API\MenuController;
use App\Http\Controllers\API\VariantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


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
});
