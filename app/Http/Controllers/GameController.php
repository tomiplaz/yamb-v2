<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Game;
use Illuminate\Support\Facades\DB;
use \Exception;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Game::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $game = Game::create($request->get('game'));
            $game->cells()->createMany($request->get('cells'));

            DB::table('games_finished')->insert(
                array_only($request->get('game'), ['user_id'])
            );

            DB::commit();
            return response('OK', 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response($e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if ($game = Game::find($id)) {
            return $game;
        } else {
            return response('Game with given ID does not exist!', 404);
        }
    }

    /**
     * Store that game has started.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function gameStarted(Request $request)
    {
        $data = $request->only('user_id');

        DB::table('games_started')->insert($data);

        return response('OK', 200);
    }
}
