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
        
        return [
            'cellsAverages' => $this->getCellsAverages($userId),
            'otherStats' => $this->getOtherStats($userId)
        ];
    }

    /**
     * Get average values for each cell.
     *
     * @return array
     */
    private function getCellsAverages($userId)
    {
        $cells = [];
        $rows = Row::all();
        $columns = Column::all();

        // Get relevant cells
        if ($userId) {
            $cells = User::find($userId)->cells()->get()->toArray();
        } else {
            $cells = Cell::all()->toArray();
        }

        // Calculate each cell's avarage value
        foreach ($rows as $row) {
            foreach ($columns as $column) {
                // Init cell key
                $cellKey = $row->abbreviation . '_' . $column->abbreviation;
                // Filter relevant cells
                $relevantCells = array_filter($cells, $this->getFilterCellByRowAndColumnId($row, $column));
                // Set avarage cell value
                if (empty($relevantCells)) {
                    $cellsAverages[$cellKey] = [
                        'averageValue' => '-',
                        'averageInputTurn' => '-'
                    ];
                } else {
                    $cellsValuesSum = array_reduce($relevantCells, $this->getSumCellsProperty('value'), 0);
                    $cellsInputTurnsSum = array_reduce($relevantCells, $this->getSumCellsProperty('input_turn'), 0);
                    $cellsValuesAverage = round($cellsValuesSum / count($relevantCells), 2);
                    $cellsInputTurnsAverage = ($cellsInputTurnsSum === 0 ? '-' : round($cellsInputTurnsSum / count($relevantCells), 2));
                    $cellsAverages[$cellKey] = [
                        'averageValue' => $cellsValuesAverage,
                        'averageInputTurn' => $cellsInputTurnsAverage
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
            'gamesPlayed' => $this->getGamesPlayed($userId),
            'gameAverages' => $this->getGameAverages($userId)
        ];
    }

    private function getFilterCellByRowAndColumnId($row, $column)
    {
        return function ($cell) use ($row, $column) {
            return $cell['row_id'] === $row->id && $cell['column_id'] === $column->id;
        };
    }

    private function sumCellsValues($carry, $relevantCell)
    {
        return $carry + $relevantCell['value'];
    }

    private function getSumCellsProperty($property)
    {
        return function ($carry, $cell) use ($property) {
            return $carry + $cell[$property];
        };
    }

    private function getGamesPlayed($userId)
    {
        if ($userId) {
            $games = User::find($userId)->games;
        } else {
            $games = Game::all();
        }

        $gamesPlayed = [
            'fiveDice' => $games->where('number_of_dice', '5')->count(),
            'sixDice' => $games->where('number_of_dice', '6')->count()
        ];

        if (!$userId) {
            $gamesPlayed['registeredUsers'] = $games->where('user_id', '!=', null)->count();
            $gamesPlayed['anonymousUsers'] = $games->where('user_id', null)->count();
        }

        return $gamesPlayed;
    }

    private function getGameAverages($userId)
    {
        if ($userId) {
            $games = User::find($userId)->games;
        } else {
            $games = Game::all();
        }

        return [
            'averageResult' => [
                'fiveDice' => $games->where('number_of_dice', '5')->average('result'),
                'sixDice' => $games->where('number_of_dice', '6')->average('result')
            ],
            'averageDuration' => [
                'fiveDice' => $games->where('number_of_dice', '5')->average('duration'),
                'sixDice' => $games->where('number_of_dice', '6')->average('duration')
            ]
        ];
    }
}
