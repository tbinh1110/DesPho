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
        Schema::create('ai_parameters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('operation_id')->constrained('ai_operations')->onDelete('cascade');
            $table->string('param_name', 100);
            $table->string('param_value', 255);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_parameters');
    }
};
