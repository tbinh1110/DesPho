<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ObjectSelectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE object_selections RESTART IDENTITY CASCADE;');
        DB::table('object_selections')->insert([
            [
                'operation_id' => 1,
                'x'            => 150,
                'y'            => 200,
                'width'        => 300,
                'height'       => 450,
            ],
            [
                'operation_id' => 1,
                'x'            => 500,
                'y'            => 600,
                'width'        => 100,
                'height'       => 100,
            ]
        ]);
    }
}
