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
            var sumRows = rows.filter(isSum);

            scope.cellClicked = cellClicked;

            scope.$on('roll', updateAvailableCells);

            initCells();

            function initCells() {
                scope.cells = {};
                iterateCells(initCell);

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

                    resetCellsAvailability();
                    scope.play.resetRollNumber();
                    scope.play.setIsInputRequired(false);
                    diceService.unlockAndDisableDice();

                    calculateSums();
                    calculateFinalResult();
                }

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
                            return diceValues.reduce(sumReduction, 0);
                        default:
                            return diceValues.reduce(oneToSixReduction, 0);
                    }

                    function getStraightValue() {
                        return isStraight() ? 66 - (scope.play.rollNumber - 1) * 10 : 0;

                        function isStraight() {
                            var sortedString = diceValues.sort().join('');
                            return (sortedString.indexOf('12345') !== -1 || sortedString.indexOf('23456') !== -1);
                        }
                    }

                    function getFullHouseValue() {
                        return isFullHouse() ? diceValues.reduce(sumReduction, 30) : 0;

                        function isFullHouse() {
                            var sorted = diceValues.sort();
                            return (sorted[0] === sorted[1] && sorted[2] === sorted[4]) ||
                                (sorted[0] === sorted[2] && sorted[3] === sorted[4]);
                        }
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

                    function oneToSixReduction(accumulator, value) {
                        var rowWeight = parseInt(cell.rowAbbreviation);
                        return accumulator + (value === rowWeight ? rowWeight : 0);
                    }
                }

                function calculateSums() {
                    iterateCells(calculateSum, 'sum');

                    function calculateSum(cellKey, row, column) {
                        switch (row.abbreviation) {
                            case 'usum':
                                var relevantValues = getRelevantValues(6);
                                if (relevantValues.every(hasValue)) {
                                    var sum = relevantValues.reduce(sumReduction, 0);
                                    scope.cells[cellKey].value = (sum >= 60 ? sum + 30 : sum);
                                }
                                break;
                            case 'msum':
                                var relevantValues = getRelevantValues(2);
                                var onesCellKey = rows[0].abbreviation + '_' + column.abbreviation;
                                if (relevantValues.every(hasValue) && scope.cells[onesCellKey].value !== null) {
                                    var difference = relevantValues[1] - relevantValues[0];
                                    scope.cells[cellKey].value = (difference < 0 ? 0 : difference * scope.cells[onesCellKey].value);
                                }
                                break;
                            case 'lsum':
                                var relevantValues = getRelevantValues(4);
                                if (relevantValues.every(hasValue)) {
                                    scope.cells[cellKey].value = relevantValues.reduce(sumReduction, 0);
                                }
                                break;
                            default:
                        }

                        function getRelevantValues(numberOfTrailingCells) {
                            var cellKey = null;
                            var relevantValues = [];

                            for (var i = 1; i <= numberOfTrailingCells; i++) {
                                cellKey = rows[row.id - 1 - i].abbreviation + '_' + column.abbreviation;
                                relevantValues.push(scope.cells[cellKey].value);
                            }

                            return relevantValues;
                        }
                    }
                }

                function calculateFinalResult() {
                    var sumsValues = getSumsValues();

                    if (sumsValues.every(hasValue)) {
                        scope.finalResult = sumsValues.reduce(sumReduction, 0);
                        scope.play.saveGame(scope.cells, scope.finalResult);
                    }

                    function getSumsValues() {
                        var sumsValues = [];

                        iterateCells(pushSumValue);

                        return sumsValues;

                        function pushSumValue(cellKey) {
                            sumsValues.push(scope.cells[cellKey].value);
                        }
                    }
                }
            }

            function updateAvailableCells() {
                resetCellsAvailability();

                getAvailableCellsKeys().forEach(setCellToAvailable);
                
                function getAvailableCellsKeys() {
                    var availableCellsKeys = [];

                    iterateCells(checkAndPushAvailableCellKey, 'playable');

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

            function resetCellsAvailability() {
                iterateCells(resetCellAvailability, 'playable');

                function resetCellAvailability(cellKey) {
                    scope.cells[cellKey].isAvailable = false;
                }
            }

            function iterateCells(callbackFunction, filterRows) {
                var rowsToIterate = rows;
                if (filterRows === 'playable') rowsToIterate = playableRows;
                if (filterRows === 'sum') rowsToIterate = sumRows;

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

            function isSum(row) {
                return row.abbreviation.indexOf('sum') !== -1;
            }

            function sumReduction(accumulator, value) {
                return accumulator + value;
            }

            function hasValue(value) {
                return value !== null;
            }
        }
    }
})();