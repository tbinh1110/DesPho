<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AiParameterSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE ai_parameters RESTART IDENTITY CASCADE;');
        DB::table('ai_parameters')->insert([
            [
                'operation_id' => 1, // remove_bg
                'param_name'   => 'action',
                'param_value'  => 'remove_bg',
            ],
            [
                'operation_id' => 2, // upscale
                'param_name'   => 'action',
                'param_value'  => 'upscale',
            ],
            [
                'operation_id' => 2,
                'param_name'   => 'scale',
                'param_value'  => '4x',
            ]
        ]);
    }
}
