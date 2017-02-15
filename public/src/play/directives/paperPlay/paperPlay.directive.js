(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .directive('paperPlay', paperPlay);
    
    paperPlay.$inject = ['diceService', 'calculationService', '$rootScope'];
    function paperPlay(diceService, calculationService, $rootScope) {
        return {
            link: link,
            templateUrl: 'src/play/directives/paperPlay/paperPlay.html',
            replace: true,
            scope: true
        };

        function link(scope) {
            var rows = $rootScope.rows;
            var columns = $rootScope.columns;
            var playableRows = rows.filter(isPlayable);
            var sumRows = rows.filter(isSum);
            var turnNumber = 0;
            var announcedCellKey = null;

            scope.cellClicked = cellClicked;

            initCells();

            function initCells() {
                scope.cells = {};
                iterateCells(initCell);

                function initCell(cellKey, row, column) {
                    scope.cells[cellKey] = {
                        row: row,
                        column: column,
                        isPlayable: isPlayable(row),
                        isAvailable: false,
                        //value: (isPlayable(row) && row.abbreviation !== '1' ? 7 : null),
                        value: null,
                        inputTurn: null
                    };
                }
            }

            function cellClicked(cellKey) {
                var cell = scope.cells[cellKey];

                if (cell.isAvailable) {
                    if (cell.column.abbreviation === 'ann' && !announcedCellKey) {
                        resetCellsAvailability();
                        announcedCellKey = cellKey;
                        scope.play.setIsAnnouncementRequired(false);
                        scope.cells[cellKey].isAvailable = true;
                    } else {
                        cell.value = getCalculatedCellValue();
                        cell.inputTurn = ++turnNumber;

                        announcedCellKey = null;
                        resetCellsAvailability();
                        scope.play.resetRollNumber();
                        scope.play.setIsInputRequired(false);
                        diceService.unlockAndDisableDice();

                        calculateSums();
                        calculateFinalResult();
                    }
                }

                function getCalculatedCellValue() {
                    var diceValues = diceService.getDiceValues();

                    switch (cell.row.abbreviation) {
                        case 'str':
                            return calculationService.getStraightValue(scope.play.rollNumber, diceValues);
                        case 'full':
                            return calculationService.getFullHouseValue(diceValues);
                        case 'quad':
                            return calculationService.getQuadsValue(diceValues);
                        case 'yamb':
                            return calculationService.getYambValue(diceValues);
                        case 'min':
                        case 'max':
                            return calculationService.getMinMaxValue(diceValues);
                        default:
                            return calculationService.getOneToSixValue(cell, diceValues);
                    }
                }

                function calculateSums() {
                    iterateCells(calculationService.getCalculateSum(rows, scope.cells), 'sum');
                }

                function calculateFinalResult() {
                    var sumsValues = getSumsValues();

                    if (sumsValues.every(hasValue)) {
                        scope.finalResult = calculationService.getFinalResult(sumsValues);
                        scope.play.saveGame(scope.cells, scope.finalResult);
                    }

                    function getSumsValues() {
                        var sumsValues = [];

                        iterateCells(pushSumValue, 'sum');

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

                if (isAnnouncementColumnTheOnlyOneLeft() && !announcedCellKey) {
                    scope.play.setIsAnnouncementRequired(true);
                } else {
                    scope.play.setIsAnnouncementRequired(false);
                }
                
                function getAvailableCellsKeys() {
                    var availableCellsKeys = [];

                    if (!announcedCellKey) {
                        iterateCells(checkAndPushAvailableCellKey, 'playable');
                    } else {
                        availableCellsKeys.push(announcedCellKey);
                    }

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

                function isAnnouncementColumnTheOnlyOneLeft() {
                    var cellKey = null;

                    for (var i = 0; i < sumRows.length; i++) {
                        for (var j = 0; j < columns.length; j++) {
                            cellKey = sumRows[i].abbreviation + '_' + columns[j].abbreviation;
                            if (columns[j].abbreviation !== 'ann' && scope.cells[cellKey].value === null) {
                                return false;
                            }
                        }
                    }

                    return true;
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

            function hasValue(value) {
                return value !== null && value !== undefined;
            }
        }
    }
})();
