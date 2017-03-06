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

            $game = Game::with('cells')->where('id', $game->id)->first();

            DB::commit();
            return response($game);
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
        DB::table('games_started')->insert($request->all());
        return response('OK', 200);
    }

    /**
     * Get last game played.
     *
     * @return \Illuminate\Http\Response
     */
    public function getLastGame()
    {
        $lastGame = Game::with('user')->orderBy('id', 'desc')->first();
        return response($lastGame);
    }
}
