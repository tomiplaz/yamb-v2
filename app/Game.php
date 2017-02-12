<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'number_of_dice', 'result', 'duration'
    ];

    /**
     * The attributes for which cast should be performed.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'int',
        'user_id' => 'int',
        'result' => 'int',
        'duration' => 'int'
    ];

    public $timestamps = false;

    /**
     * Get game's user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    /**
     * Get game's cells.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cells()
    {
        return $this->hasMany('App\Cell');
    }
}
