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

Route::group(['domain' => env('APP_URL')], function() {
    Route::group(['prefix' => 'users'], function() {
        Route::get('{id}/best-games', 'UserController@getBestGames');
    });

    Route::group(['prefix' => 'games'], function() {
        Route::post('game-started', 'GameController@gameStarted');
        Route::get('last-game', 'GameController@getLastGame');
    });

    Route::group(['prefix' => 'statistics'], function() {
        Route::get('', 'StatisticsController@getAll');
        Route::get('{id}', 'StatisticsController@getAll');
    });
    
    Route::resource('users', 'UserController', ['only' => ['index', 'show']]);

    Route::resource('games', 'GameController', ['only' => ['index', 'store', 'show']]);

    Route::resource('rows', 'RowController', ['only' => ['index']]);

    Route::resource('columns', 'ColumnController', ['only' => ['index']]);
});
