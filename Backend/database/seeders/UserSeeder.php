<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');

        DB::table('users')->insert([
            [
                'email'         => 'nbinh3120@gmail.com',
                'password'      => Hash::make('123456'),
                'phone_number'  => '0987654321',
                'google_id'     => 'google_id_sample_1',
                'full_name'     => 'Nguyễn Diệp Thanh Bình',
                'role'          => 'customer',
                'credits'       => 500,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'email'         => 'phamthikieu@gmail.com',
                'password'      => Hash::make('123456'),
                'phone_number'  => '0911223344',
                'google_id'     => null,
                'full_name'     => 'Phạm Thị Kiều',
                'role'          => 'customer',
                'credits'       => 100,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]
        ]);
    }
}
