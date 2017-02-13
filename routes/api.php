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

Route::resource('rows', 'RowController', ['only' => ['index']]);

Route::resource('columns', 'ColumnController', ['only' => ['index']]);

Route::group(['prefix' => 'users'], function() {
    Route::post('{id}/increment-unfinished-games', 'UserController@incrementUnfinishedGames');
});

Route::group(['prefix' => 'statistics'], function() {
    Route::get('average-cells-values', 'StatisticsController@getAvarageCellsValues');
    Route::get('{id}/average-cells-values', 'StatisticsController@getAvarageCellsValues');
});
