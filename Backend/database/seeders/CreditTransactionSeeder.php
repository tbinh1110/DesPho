<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreditTransactionSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE credit_transactions RESTART IDENTITY CASCADE;');
        DB::table('credit_transactions')->insert([
            [
                'user_id'      => 1, 
                'operation_id' => null,
                'amount'       => 500,
                'type'         => 'add',
                'created_at'   => '2026-03-08 08:15:00',
            ],
            [
                'user_id'      => 1,
                'operation_id' => 1,
                'amount'       => 10,
                'type'         => 'use',
                'created_at'   => '2026-03-08 09:32:00',
            ],
        ]);
    }
}
