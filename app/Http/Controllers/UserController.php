<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\DB;

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
     * Get user's best games.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getBestGames(Request $request, $id)
    {
        $bestGames = [];

        foreach (['5', '6'] as $numberOfDice) {
            $numberOfDiceKey = $numberOfDice . '_dice';
            $bestGames[$numberOfDiceKey] = User::find($id)
                ->games()->with('cells')
                ->where('number_of_dice', $numberOfDice)
                ->whereRaw('result', DB::raw("(select max('result') from games)"))
                ->first();
        }

        return response()->json($bestGames);
    }
}
