<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AiOperationSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE ai_operations RESTART IDENTITY CASCADE;');
        DB::table('ai_operations')->insert([
            [
                'user_id'            => 1, 
                'provider_id'        => 1,
                'batch_id'           => 1,
                'input_image_id'     => 1,
                'output_image_id'    => null,
                'operation_type'     => 'remove_bg',
                'request_payload'    => json_encode(['action' => 'remove_bg']),
                'response_payload'   => json_encode(['status' => 'success', 'file' => 'ai_remove_bg_123.png']),
                'status'             => 'completed',
                'error_message'      => null,
                'processing_time_ms' => 4500,
                'created_at'         => '2026-03-08 09:32:00',
                'updated_at'         => '2026-03-08 09:32:04',
            ],
            [
                'user_id'            => 2,
                'provider_id'        => 2,
                'batch_id'           => 2,
                'input_image_id'     => 2,
                'output_image_id'    => null,
                'operation_type'     => 'upscale',
                'request_payload'    => json_encode(['action' => 'upscale']),
                'response_payload'   => null,
                'status'             => 'processing',
                'error_message'      => null,
                'processing_time_ms' => null,
                'created_at'         => '2026-03-08 09:40:00',
                'updated_at'         => '2026-03-08 09:40:00',
            ]
        ]);
    }
}
