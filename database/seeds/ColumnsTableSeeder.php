<?php

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class ColumnsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $columns = [
            [
                'name' => 'Down',
                'description' => 'Down column description.',
                'abbreviation' => 'dwn'
            ],
            [
                'name' => 'Any',
                'description' => 'Any column description.',
                'abbreviation' => 'any'
            ],
            [
                'name' => 'Up',
                'description' => 'Up column description.',
                'abbreviation' => 'up'
            ],
            [
                'name' => 'Announcement',
                'description' => 'Announcement column description.',
                'abbreviation' => 'ann'
            ]
        ];

        DB::table('columns')->insert($columns);
    }
}
