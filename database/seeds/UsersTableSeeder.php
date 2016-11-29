<?php

use Illuminate\Database\Seeder;

use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Tomislav',
            'email' => 'tomislav@gmail.com',
            'password' => 'tomislav1'
        ]);

        User::create([
            'name' => 'Tamara',
            'email' => 'tamara@gmail.com',
            'password' => 'tamara2'
        ]);
    }
}
