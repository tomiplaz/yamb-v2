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

            scope.$on('roll', updateAvailableCells);

            initCells();

            function initCells() {
                scope.cells = {};
                iterateCells(initCell, false);

                function initCell(cellKey, row, column) {
                    scope.cells[cellKey] = {
                        rowAbbreviation: row.abbreviation,
                        columnAbbreviation: column.abbreviation,
                        isPlayable: isPlayable(row),
                        isAvailable: false,
                        value: null
                    };
                }
            }

            function cellClicked(cellKey) {
                var cell = scope.cells[cellKey];

                if (cell.isAvailable) {
                    cell.value = getCalculatedCellValue();
                }

                scope.play.resetRollNumber();

                function getCalculatedCellValue() {
                    var diceValues = diceService.getDiceValues();

                    switch (cell.rowAbbreviation) {
                        case 'str':
                            return getStraightValue();
                        case 'full':
                            return getFullHouseValue();
                        case 'quad':
                            return getQuadsValue();
                        case 'yamb':
                            return getYambValue();
                        case 'min':
                        case 'max':
                            return diceValues.reduce(minMaxReduction, 0);
                        default:
                            return diceValues.reduce(oneToSixReduction, 0);
                    }

                    function getStraightValue() {
                        return isStraight() ? 66 - (scope.play.rollNumber - 1) * 10 : 0;

                        function isStraight() {
                            var sortedString = diceValues.sort().join('');
                            return (sortedString.indexOf('12345') === -1 || sortedString.indexOf('23456') === -1)
                        }
                    }

                    function getFullHouseValue() {
                        return 0;
                    }

                    function getQuadsValue() {
                        var sorted = diceValues.sort();

                        return isQuads() ? 40 + sorted[1] * 4 : 0;

                        function isQuads() {
                            return sorted[0] === sorted[3] || sorted[1] === sorted[4];
                        }
                    }

                    function getYambValue() {
                        return isYamb() ? 50 + diceValues[0] * 5 : 0;

                        function isYamb() {
                            for (var i = 1; i < diceValues.length; i++) {
                                if (diceValues[i] !== diceValues[i - 1]) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    }

                    function minMaxReduction(accumulator, value) {
                        return accumulator + value;
                    }

                    function oneToSixReduction(accumulator, value) {
                        var rowWeight = parseInt(cell.rowAbbreviation);
                        return accumulator + (value === rowWeight ? rowWeight : 0);
                    }
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
