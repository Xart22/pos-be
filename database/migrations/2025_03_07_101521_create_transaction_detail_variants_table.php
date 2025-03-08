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
        Schema::create('transaction_detail_variants', function (Blueprint $table) {
            $table->bigInteger('transaction_detail_id')->foreign('transaction_detail_id')->references('id')->on('transaction_details')->onDelete('cascade');
            $table->bigInteger('variant_id')->foreign('variant_id')->references('id')->on('variants')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_detail_variants');
    }
};
