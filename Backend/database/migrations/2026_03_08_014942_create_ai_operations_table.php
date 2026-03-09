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
        Schema::create('ai_operations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('provider_id')->constrained('ai_providers');
            $table->foreignId('batch_id')->nullable()->constrained('operation_batches')->onDelete('set null');
            $table->foreignId('input_image_id')->constrained('images');
            $table->foreignId('output_image_id')->nullable()->constrained('images');
            $table->string('operation_type', 50);
            $table->text('request_payload')->nullable();
            $table->text('response_payload')->nullable();
            $table->enum('status', ['pending', 'processing', 'completed', 'failed']);
            $table->text('error_message')->nullable();
            $table->integer('processing_time_ms')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_operations');
    }
};
