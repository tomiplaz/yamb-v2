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
            'cellsAverages' => $this->getCellsAverages($userId),
            'otherStats' => $this->getOtherStats($userId)
        ]);
    }

    /**
     * Get average values for each cell.
     *
     * @return array
     */
    private function getCellsAverages($userId)
    {
        // Init query
        if ($userId) {
            $cells = User::find($userId)->cells();
        } else {
            $cells = Cell::getModel();
        }

        $cellsAverages = [];

        foreach (Row::all() as $row) {
            foreach (Column::all() as $column) {
                // Init cell key
                $cellKey = $row->abbreviation . '_' . $column->abbreviation;
                // Query relevant cells
                $relevantCells = (clone $cells)->where('row_id', $row->id)->where('column_id', $column->id);
                // Set cell's averages
                $cellsAverages[$cellKey] = [
                    'averageValue' => round($relevantCells->avg('value'), 2),
                    'averageInputTurn' => round($relevantCells->avg('input_turn'), 2) ?: '-'
                ];
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
            'gamesPlayed' => $this->getGamesPlayed($userId),
            'gameAverages' => $this->getGameAverages($userId)
        ];
    }

    /**
     * Get games played count.
     *
     * @return array
     */
    private function getGamesPlayed($userId)
    {
        // Init query
        if ($userId) {
            $games = User::find($userId)->games();
        } else {
            $games = Game::getModel();
        }

        // Set common counts
        $gamesPlayed = [
            'fiveDice' => (clone $games)->where('number_of_dice', '5')->count(),
            'sixDice' => (clone $games)->where('number_of_dice', '6')->count()
        ];

        // Set additional global counts
        if (!$userId) {
            $gamesPlayed['registeredUsers'] = (clone $games)->where('user_id', '!=', null)->count();
            $gamesPlayed['anonymousUsers'] = (clone $games)->where('user_id', null)->count();
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
        // Init query
        if ($userId) {
            $games = User::find($userId)->games();
        } else {
            $games = Game::getModel();
        }

        return [
            'averageResult' => [
                'fiveDice' => round((clone $games)->where('number_of_dice', '5')->avg('result'), 2),
                'sixDice' => round((clone $games)->where('number_of_dice', '6')->avg('result'), 2)
            ],
            'averageDuration' => [
                'fiveDice' => (clone $games)->where('number_of_dice', '5')->avg('duration'),
                'sixDice' => (clone $games)->where('number_of_dice', '6')->avg('duration')
            ]
        ];
    }
}
