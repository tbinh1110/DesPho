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
        Schema::create('credit_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150); // VD: Gói Cơ Bản, Gói Pro
            $table->integer('credits'); // VD: 500
            $table->decimal('price', 10, 2); // VD: 9.99
            $table->string('currency', 10)->default('USD');
            $table->boolean('is_active')->default(true); // Để ẩn/hiện gói
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_packages');
    }
};
