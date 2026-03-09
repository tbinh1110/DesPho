<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AiProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE ai_providers RESTART IDENTITY CASCADE;');
        DB::table('ai_providers')->insert([
            [
                'name'       => 'OpenAI',
                'base_url'   => 'https://api.openai.com/v1',
                'created_at' => '2026-03-08 08:00:00',
            ],
            [
                'name'       => 'Stability AI',
                'base_url'   => 'https://api.stability.ai/v1',
                'created_at' => '2026-03-08 08:00:00',
            ],
            [
                'name'       => 'Runway ML',
                'base_url'   => 'https://api.runwayml.com/v1',
                'created_at' => '2026-03-08 08:00:00',
            ]
        ]);
    }
}
