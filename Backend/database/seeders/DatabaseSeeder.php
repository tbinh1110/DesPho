<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            AdminAccountSeeder::class,
            UserSeeder::class,
            AiProviderSeeder::class,
            PaymentSeeder::class,
            ImageSeeder::class,
            OperationBatchSeeder::class,
            AiOperationSeeder::class,
            AiParameterSeeder::class,
            ObjectSelectionSeeder::class,
            CreditTransactionSeeder::class,
        ]);

    }
}
