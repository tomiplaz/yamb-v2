<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cell extends Model
{
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'game_id', 'column_id', 'row_id', 'value'
    ];

    /**
     * The attributes for which cast should be performed.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'int',
        'game_id' => 'int',
        'column_id' => 'int',
        'row_id' => 'int',
        'value_id' => 'int'
    ];
}