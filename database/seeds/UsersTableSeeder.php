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
        $users = [
            [
                'name' => 'Tomislav',
                'email' => 'tomislav@gmail.com',
                'password' => 'tomislav1'
            ],
            [
                'name' => 'Tamara',
                'email' => 'tamara@gmail.com',
                'password' => 'tamara2'
            ]
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
