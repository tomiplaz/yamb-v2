<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Game;
use App\Cell;
use App\User;
use App\Row;
use App\Column;

class StatisticsController extends Controller
{
    /**
     * Get all statistics.
     *
     * @return array
     */
    public function getAll(Request $request)
    {
        $userId = $request->route('id');

        return response()->json([
            'cells_averages' => $this->getCellsAverages($userId),
            'other_stats' => $this->getOtherStats($userId)
        ]);
    }

    /**
     * Get average values for each cell.
     *
     * @return array
     */
    private function getCellsAverages($userId)
    {
        $cellsAverages = [];

        // Init query
        if ($userId) {
            $cells = User::find($userId)->cells();
        } else {
            $cells = Cell::getModel();
        }

        foreach (['5', '6'] as $numberOfDice) {
            $numberOfDiceKey = $numberOfDice . '_dice';
            
            foreach (Row::all() as $row) {
                foreach (Column::all() as $column) {
                    // Init cell key
                    $cellKey = $row->abbreviation . '_' . $column->abbreviation;
                    $cellsAverages[$numberOfDiceKey][$cellKey] = [];
                    // Query relevant cells
                    $relevantCells = (clone $cells)->whereHas('game', function($query) use($numberOfDice) {
                        $query->where('number_of_dice', $numberOfDice);
                    })->where('row_id', $row->id)->where('column_id', $column->id);
                    // Set cell's averages
                    $cellsAverages[$numberOfDiceKey][$cellKey] = [
                        'value' => $relevantCells->count() ? round($relevantCells->avg('value'), 2) : '-',
                        'input_turn' => round($relevantCells->avg('input_turn'), 2) ?: '-'
                    ];
                }
            }
        }

        return $cellsAverages;
    }

    /**
     * Get stats not related to cells.
     *
     * @return array
     */
    private function getOtherStats($userId)
    {
        return [
            'games_played' => $this->getGamesPlayed($userId),
            'game_averages' => $this->getGameAverages($userId)
        ];
    }

    /**
     * Get games played count.
     *
     * @return array
     */
    private function getGamesPlayed($userId)
    {
        $gamesPlayed = [];

        // Init query
        if ($userId) {
            $games = User::find($userId)->games();
        } else {
            $games = Game::getModel();
        }

        foreach (['5', '6'] as $numberOfDice) {
            $numberOfDiceKey = $numberOfDice . '_dice';

            // Set common counts
            $gamesPlayed[$numberOfDiceKey] = [
                'total' => (clone $games)->where('number_of_dice', $numberOfDice)->count()
            ];

            // Set user-wise counts
            if (!$userId) {
                foreach (['registered', 'anonymous'] as $key) {
                    $operator = ($key === 'registered' ? '!=' : '=');
                    $gamesPlayed[$numberOfDiceKey][$key] = (clone $games)
                        ->where('number_of_dice', $numberOfDice)
                        ->where('user_id', $operator, null)
                        ->count();
                }
            }
        }

        return $gamesPlayed;
    }

    /**
     * Get game averages.
     *
     * @return array
     */
    private function getGameAverages($userId)
    {
        $gameAverages = [];

        if ($userId) {
            $games = User::find($userId)->games();
        } else {
            $games = Game::getModel();
        }

        foreach (['5', '6'] as $numberOfDice) {
            $numberOfDiceKey = $numberOfDice . '_dice';
            $gameAverages[$numberOfDiceKey] = [];

            foreach (['result', 'duration'] as $field) {
                $value = round((clone $games)->where('number_of_dice', $numberOfDice)->avg($field), 2);
                $gameAverages[$numberOfDiceKey][$field] = ($value ?: '-');
            }
        }

        return $gameAverages;
    }
}
