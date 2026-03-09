<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE images RESTART IDENTITY CASCADE;');
        DB::table('images')->insert([
            [
                'user_id'           => 1,
                'original_image_id' => null,
                'image_url'         => 'https://despho.com/storage/uploads/raw/anh_chan_dung_1.jpg',
                'file_size'         => 2048000,
                'width'             => 1920,
                'height'            => 1080,
                'format'            => 'jpg',
                'created_at'        => '2026-03-08 09:30:00',
            ],
            [
                'user_id'           => 2,
                'original_image_id' => null,
                'image_url'         => 'https://despho.com/storage/uploads/raw/phong_canh_bien.png',
                'file_size'         => 5120000,
                'width'             => 2560,
                'height'            => 1440,
                'format'            => 'png',
                'created_at'        => '2026-03-08 09:35:00',
            ]
        ]);
    }
}
