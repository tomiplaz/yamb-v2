<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::all();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if ($user = User::find($id)) {
            return $user;
        } else {
            return response('User with given ID does not exist!', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if ($user = User::find($id)) {
            $user->update($request->input());
            return response('User updated!');
        } else {
            return response('User with given ID does not exist!', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if ($user = User::find($id)) {
            $user->delete();
            return response('User deleted!');
        } else {
            return response('User with given ID does not exist!', 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function incrementUnfinishedGames($id)
    {
        if ($user = User::find($id)) {
            $user->increment('unfinished_games');
            return response('OK');
        } else {
            return response('User with given ID does not exist!', 400);
        }
    }
}
