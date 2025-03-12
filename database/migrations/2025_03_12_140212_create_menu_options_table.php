<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menu_options', function (Blueprint $table) {
            $table->id();
            $table->integer('menu_id')->references('id')->on('menus')->onDelete('cascade');
            $table->integer('variant_id')->references('id')->on('variants')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_options');
    }
};
