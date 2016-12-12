<?php

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class RowsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $rows = [
            [
                'name' => '1',
                'description' => '1 row description.',
                'abbreviation' => '1'
            ],
            [
                'name' => '2',
                'description' => '2 row description.',
                'abbreviation' => '2'
            ],
            [
                'name' => '3',
                'description' => '3 row description.',
                'abbreviation' => '3'
            ],
            [
                'name' => '4',
                'description' => '4 column description.',
                'abbreviation' => '4'
            ],
            [
                'name' => '5',
                'description' => '5 column description.',
                'abbreviation' => '5'
            ],
            [
                'name' => '6',
                'description' => '6 column description.',
                'abbreviation' => '6'
            ],
            [
                'name' => 'Upper Sum',
                'description' => 'Upper Sum row description.',
                'abbreviation' => 'ups'
            ],
            [
                'name' => 'Maximum',
                'description' => 'Maximum row description.',
                'abbreviation' => 'max'
            ],
            [
                'name' => 'Minimum',
                'description' => 'Minimum row description.',
                'abbreviation' => 'min'
            ],
            [
                'name' => 'Middle Sum',
                'description' => 'Middle Sum row description.',
                'abbreviation' => 'mids'
            ],
            [
                'name' => 'Straight',
                'description' => 'Straight row description.',
                'abbreviation' => 'str'
            ],
            [
                'name' => 'Full House',
                'description' => 'Full House row description.',
                'abbreviation' => 'full'
            ],
            [
                'name' => 'Quads',
                'description' => 'Quads row description.',
                'abbreviation' => 'quad'
            ],
            [
                'name' => 'Yamb',
                'description' => 'Yamb row description.',
                'abbreviation' => 'yamb'
            ],
            [
                'name' => 'Lower Sum',
                'description' => 'Lower Sum row description.',
                'abbreviation' => 'lows'
            ]
        ];

        DB::table('rows')->insert($rows);
    }
}
