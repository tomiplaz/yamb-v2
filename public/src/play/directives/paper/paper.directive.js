(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .directive('paper', paper);
    
    paper.$inject = ['diceService'];
    function paper(diceService) {
        return {
            link: link,
            templateUrl: 'src/play/directives/paper/paper.html',
            replace: true,
            scope: true
        };

        function link(scope, elem, attrs) {
            var rows = scope.play.rows;
            var columns = scope.play.columns;
            var playableRows = rows.filter(isPlayable);

            scope.cellClicked = cellClicked;

            initCells();

            scope.$on('roll', updateAvailableCells);

            function cellClicked(cellKey) {
                var cell = scope.cells[cellKey];

                if (cell.isAvailable) {
                    cell.value = getCalculatedCellValue();
                }

                function getCalculatedCellValue() {
                    var diceValues = diceService.getDiceValues();

                    switch (cell.row) {
                        //
                    }
                }
            }

            function initCells() {
                scope.cells = {};
                iterateCells(initCell, false);

                function initCell(cellKey, row, column) {
                    scope.cells[cellKey] = {
                        row: row.abbreviation,
                        column: column.abbreviation,
                        isPlayable: isPlayable(row),
                        isAvailable: false,
                        value: null
                    };
                }
            }

            function updateAvailableCells() {
                resetCellsAvailability();

                getAvailableCellsKeys().forEach(setCellToAvailable);

                function resetCellsAvailability() {
                    iterateCells(resetCellAvailability, true);

                    function resetCellAvailability(cellKey) {
                        scope.cells[cellKey].isAvailable = false;
                    }
                }
                
                function getAvailableCellsKeys() {
                    var availableCellsKeys = [];

                    iterateCells(checkAndPushAvailableCellKey, true);

                    return availableCellsKeys;

                    function checkAndPushAvailableCellKey(cellKey, row, column, rowIndex, columnIndex) {
                        if (!isCellEmpty(cellKey)) return;

                        switch (column.abbreviation) {
                            case 'dwn':
                                if (row.abbreviation === '1') {
                                    availableCellsKeys.push(cellKey);
                                } else {
                                    var previousPlayableCellKey = getPlayableCellKey(rowIndex - 1, columnIndex);
                                    if (!isCellEmpty(previousPlayableCellKey)) {
                                        availableCellsKeys.push(cellKey);
                                    }
                                }
                                return;
                            case 'any':
                                availableCellsKeys.push(cellKey);
                                return;
                            case 'up':
                                if (row.abbreviation === 'yamb') {
                                    availableCellsKeys.push(cellKey);
                                } else {
                                    var nextPlayableCellKey = getPlayableCellKey(rowIndex + 1, columnIndex);
                                    if (!isCellEmpty(nextPlayableCellKey)) {
                                        availableCellsKeys.push(cellKey);
                                    }
                                }
                                return;
                            case 'ann':
                                if (scope.play.rollNumber === 1) {
                                    availableCellsKeys.push(cellKey);
                                    return;
                                }
                            default:
                                return;
                        }

                        function isCellEmpty(cellKey) {
                            return (scope.cells[cellKey].value === null);
                        }

                        function getPlayableCellKey(rowIndex, columnIndex) {
                            return playableRows[rowIndex].abbreviation + '_' + columns[columnIndex].abbreviation;
                        }
                    }
                }

                function setCellToAvailable(cellKey) {
                    scope.cells[cellKey].isAvailable = true;
                }
            }

            function iterateCells(callbackFunction, onlyPlayable) {
                var rowsToIterate = (onlyPlayable ? playableRows : rows);
                rowsToIterate.forEach(function(row, rowIndex) {
                    columns.forEach(function(column, columnIndex) {
                        var cellKey = row.abbreviation + '_' + column.abbreviation;
                        callbackFunction(cellKey, row, column, rowIndex, columnIndex);
                    });
                });     
            }

            function isPlayable(row) {
                return row.abbreviation.indexOf('sum') === -1;
            }
        }
    }
})();
