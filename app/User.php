<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

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
        'best_results', 'average_results', 'average_duration', 'games_played'
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
        return [
            'fiveDice' => $this->games()->where('number_of_dice', '5')->count(),
            'sixDice' => $this->games()->where('number_of_dice', '6')->count()
        ];
    }

    /**
     * Get user's best results.
     *
     * @return array
     */
    public function getBestResultsAttribute()
    {
        return [
            'fiveDice' => $this->games()->where('number_of_dice', '5')->max('result'),
            'sixDice' => $this->games()->where('number_of_dice', '6')->max('result')
        ];
    }

    /**
     * Get user's average results.
     *
     * @return array
     */
    public function getAverageResultsAttribute()
    {
        return [
            'fiveDice' => $this->games()->where('number_of_dice', '5')->avg('result'),
            'sixDice' => $this->games()->where('number_of_dice', '6')->avg('result')
        ];
    }

    /**
     * Get user's average duration.
     *
     * @return array
     */
    public function getAverageDurationAttribute()
    {
        return [
            'fiveDice' => $this->games()->where('number_of_dice', '5')->avg('duration'),
            'sixDice' => $this->games()->where('number_of_dice', '6')->avg('duration')
        ];
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
