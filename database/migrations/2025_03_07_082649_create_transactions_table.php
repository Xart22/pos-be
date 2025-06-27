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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('promo_id')->nullable()->constrained('promos')->onDelete('cascade');
            $table->enum('type', ['DINE_IN', 'TAKE_AWAY', 'GOFOOD', 'GRABFOOD', 'SHOPPEFOOD']);
            $table->enum('status', ['PROCESS', 'READY', 'CANCEL']);
            $table->integer('table_number')->nullable();
            $table->string('customer_name');
            $table->bigInteger('cash')->nullable();
            $table->bigInteger('change')->nullable();
            $table->bigInteger('discount')->nullable();
            $table->bigInteger('total_price')->nullable();
            $table->enum('payment_method', ['CASH', 'TRANSFER', 'QRIS']);
            $table->string('payment_status')->nullable();
            $table->string('payment_proof')->nullable();
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
