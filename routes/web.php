<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    return view('index');
});

Route::post('register', 'Auth\AuthController@register');

Route::post('login', 'Auth\AuthController@login');

// Redirect to index to let Angular handle routes
Route::get('{any?}', function () {
    return view('index');
});
