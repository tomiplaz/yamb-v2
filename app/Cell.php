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
        'game_id', 'column_id', 'row_id', 'value', 'input_turn'
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
        'value' => 'int',
        'input_turn' => 'int'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'cell_key'
    ];

    public $timestamps = false;

    /**
     * Get cell's key.
     *
     * @return string
     */
    public function getCellKeyAttribute()
    {
        return $this->row()->first()->abbreviation . '_' . $this->column()->first()->abbreviation;
    }

    /**
     * Get cell's game.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function game()
    {
        return $this->belongsTo('App\Game');
    }

    /**
     * Get cell's row.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function row()
    {
        return $this->belongsTo('App\Row');
    }

    /**
     * Get cell's column.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function column()
    {
        return $this->belongsTo('App\Column');
    }
}
