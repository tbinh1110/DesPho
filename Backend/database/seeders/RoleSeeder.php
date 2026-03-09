<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin: Có mọi quyền (*)
        Role::create([
            'id'          => 1,
            'name'        => 'Super Admin',
            'permissions' => ['*'],
        ]);

        // 2. Kế toán: Chỉ được xem user và xử lý tiền
        Role::create([
            'id'          => 2,
            'name'        => 'Kế Toán',
            'permissions' => ['view_users', 'view_payments', 'add_credits'],
        ]);

        // 3. Chăm sóc khách hàng: Chỉ được xem, không được sửa tiền
        Role::create([
            'id'          => 3,
            'name'        => 'CSKH',
            'permissions' => ['view_users', 'view_ai_history'],
        ]);
    }
}
