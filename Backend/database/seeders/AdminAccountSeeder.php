<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminAccountSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE admin_accounts RESTART IDENTITY CASCADE;');

        DB::table('admin_accounts')->insert([
            // 1. Tài khoản Super Admin (Toàn quyền)
            [
                'role_id'       => 1,
                'email'         => 'admin@despho.com',
                'password'      => Hash::make('123456'),
                'full_name'     => 'Boss Tổng',
                'phone_number'  => '0900000000',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            // 2. Tài khoản Kế toán (Chỉ xem user và cộng tiền)
            [
                'role_id'       => 2,
                'email'         => 'ketoan@despho.com',
                'password'      => Hash::make('123456'),
                'full_name'     => 'Nhân Viên Kế Toán',
                'phone_number'  => '0911111111',
                'created_at'    => now(),
                'updated_at'    => now(),
            ]
        ]);
    }
}
