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
     * Returns an avarage value of each cell.
     *
     * @return array
     */
    public function getAvarageCellsValuesAndInputTurns(Request $request) {
        $userId = $request->route('id');
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
                    $cellsValuesAverage = $cellsValuesSum / count($relevantCells);
                    $cellsInputTurnsAverage = ($cellsInputTurnsSum === 0 ? '-' : $cellsInputTurnsSum / count($relevantCells));
                    $cellsAverages[$cellKey] = [
                        'averageValue' => $cellsValuesAverage,
                        'averageInputTurn' => $cellsInputTurnsAverage
                    ];
                }
            }
        }

        return $cellsAverages;
    }

    private function getFilterCellByRowAndColumnId($row, $column) {
        return function ($cell) use ($row, $column) {
            return $cell['row_id'] === $row->id && $cell['column_id'] === $column->id;
        };
    }

    private function sumCellsValues($carry, $relevantCell) {
        return $carry + $relevantCell['value'];
    }

    private function getSumCellsProperty($property) {
        return function ($carry, $cell) use ($property) {
            return $carry + $cell[$property];
        };
    }
}
