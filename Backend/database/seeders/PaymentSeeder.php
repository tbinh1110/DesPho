<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE payments RESTART IDENTITY CASCADE;');
        DB::table('payments')->insert([
            [
                'user_id'        => 1,
                'amount'         => 9.99,
                'credits_added'  => 500,
                'payment_method' => 'stripe',
                'status'         => 'completed',
                'created_at'     => '2026-03-08 08:15:00',
            ],
            [
                'user_id'        => 2,
                'amount'         => 19.99,
                'credits_added'  => 1200,
                'payment_method' => 'paypal',
                'status'         => 'completed',
                'created_at'     => '2026-03-08 09:05:00',
            ]
        ]);
    }
}
