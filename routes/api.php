<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::resource('users', 'UserController', ['only' => ['index', 'show', 'update', 'destroy']]);

Route::resource('games', 'GameController', ['only' => ['index', 'store', 'show']]);

Route::get('columns', function () {
    return DB::table('columns')->get();
});

Route::get('rows', function () {
    return DB::table('rows')->get();
});
