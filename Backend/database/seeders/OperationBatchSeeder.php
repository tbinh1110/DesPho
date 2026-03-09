<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OperationBatchSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE operation_batches RESTART IDENTITY CASCADE;');
        DB::table('operation_batches')->insert([
            [
                'user_id'        => 1,
                'batch_name'     => 'Xóa nền ảnh sản phẩm lô 1',
                'operation_type' => 'remove_bg',
                'status'         => 'completed',
                'created_at'     => '2026-03-08 10:00:00',
            ],
            [
                'user_id'        => 2, 
                'batch_name'     => 'Upscale ảnh phong cảnh',
                'operation_type' => 'upscale',
                'status'         => 'processing',
                'created_at'     => '2026-03-08 10:30:00',
            ]
        ]);
    }
}
