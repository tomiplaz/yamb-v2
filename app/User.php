<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token'
    ];

    /**
     * The attributes for which cast should be performed.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'int'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'games_played', 'unfinished_games', 'best_results', 'average_results', 'average_duration',
        'last_game_timestamp'
    ];

    /**
     * Encrypt password before storing it.
     *
     * @param  string  $value
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    /**
     * Get user's number of games played.
     *
     * @return array
     */
    public function getGamesPlayedAttribute()
    {
        $gamesPlayed = [];

        foreach (['5', '6'] as $numberOfDice) {
            $numberOfDiceKey = $numberOfDice . '_dice';
            $gamesPlayed[$numberOfDiceKey] = $this->games()->where('number_of_dice', $numberOfDice)->count();
        }

        return $gamesPlayed;
    }

    /**
     * Get user's number of unfinished games.
     *
     * @return array
     */
    public function getUnfinishedGamesAttribute()
    {
        $unfinishedGames = [];

        foreach (['5', '6'] as $numberOfDice) {
            $numberOfDiceKey = $numberOfDice . '_dice';
            $gamesStarted = DB::table('games_started')
                ->where('number_of_dice', $numberOfDice)->where('user_id', $this->id)->count();
            $gamesFinished = $this->games()
                ->where('number_of_dice', $numberOfDice)->count();
            $unfinishedGames[$numberOfDiceKey] = $gamesStarted - $gamesFinished;
        }

        return $unfinishedGames;
    }

    /**
     * Get user's best results.
     *
     * @return array
     */
    public function getBestResultsAttribute()
    {
        $bestResults = [];

        foreach (['5', '6'] as $numberOfDice) {
            $numberOfDiceKey = $numberOfDice . '_dice';
            $bestResults[$numberOfDiceKey] = $this->games()->where('number_of_dice', $numberOfDice)->max('result');
        }

        return $bestResults;
    }

    /**
     * Get user's average results.
     *
     * @return array
     */
    public function getAverageResultsAttribute()
    {
        $avarageResults = [];

        foreach (['5', '6'] as $numberOfDice) {
            $numberOfDiceKey = $numberOfDice . '_dice';
            $avarageResults[$numberOfDiceKey] = round(
                $this->games()->where('number_of_dice', $numberOfDice)->avg('result'), 2
            );
        }

        return $avarageResults;
    }

    /**
     * Get user's average duration.
     *
     * @return array
     */
    public function getAverageDurationAttribute()
    {
        $avarageDuration = [];

        foreach (['5', '6'] as $numberOfDice) {
            $numberOfDiceKey = $numberOfDice . '_dice';
            $avarageDuration[$numberOfDiceKey] = round(
                $this->games()->where('number_of_dice', $numberOfDice)->avg('duration'), 2
            );
        }

        return $avarageDuration;
    }

    /**
     * Get user's last game timestamp.
     *
     * @return array
     */
    public function getLastGameTimestampAttribute()
    {
        $lastGameTimestamp = [];

        foreach (['5', '6'] as $numberOfDice) {
            $numberOfDiceKey = $numberOfDice . '_dice';
            $lastGame = $this->games()
                ->where('number_of_dice', $numberOfDice)
                ->orderBy('created_at', 'desc')
                ->first();
            $lastGameTimestamp[$numberOfDiceKey] = ($lastGame ? $lastGame->created_at : null);
        }

        return $lastGameTimestamp;
    }

    /**
     * Get user's games.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function games()
    {
        return $this->hasMany('App\Game');
    }

    /**
     * Get user's cells.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
    public function cells()
    {
        return $this->hasManyThrough('App\Cell', 'App\Game', 'user_id', 'game_id', 'id');
    }
}
