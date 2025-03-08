<?php

use App\Http\Controllers\API\CategoriController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('/categories')->group(function () {
    Route::get('/', [CategoriController::class, 'index']);
    Route::post('/store', [CategoriController::class, 'store']);
    Route::get('/edit/{id}', [CategoriController::class, 'edit']);
    Route::post('/update/{id}', [CategoriController::class, 'update']);
    Route::delete('/delete/{id}', [CategoriController::class, 'destroy']);
});
