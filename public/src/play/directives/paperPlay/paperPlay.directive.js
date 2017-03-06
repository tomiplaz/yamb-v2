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
            var savedState = null;

            scope.cellClicked = cellClicked;

            scope.$on('roll', updateAvailableCells);

            scope.$on('undo', handleUndo);

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
                        value: null,
                        inputTurn: null
                    };
                }
            }

            function cellClicked(cellKey) {
                var cell = scope.cells[cellKey];

                updateSavedState(cellKey);

                if (cell.isAvailable) {
                    if (cell.column.abbreviation === 'ann' && !announcedCellKey) {
                        resetCellsAvailability();
                        announcedCellKey = cellKey;
                        scope.play.setIsAnnouncementRequired(false);
                        cell.isAvailable = true;
                    } else {
                        cell.value = getCalculatedCellValue();
                        cell.inputTurn = ++turnNumber;

                        announcedCellKey = null;
                        resetCellsAvailability();
                        scope.play.setRollNumber(0);
                        scope.play.setIsInputRequired(false);
                        diceService.unlockAndDisableDice();

                        calculateSums();
                        calculateFinalResult();
                    }

                    scope.play.setIsUndoAvailable(true);
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
                            return calculationService.getMinValue(diceValues);
                        case 'max':
                            return calculationService.getMaxValue(diceValues);
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

            function handleUndo() {
                scope.play.setIsUndoAvailable(false);

                if (announcedCellKey) {
                    announcedCellKey = null;
                } else {
                    turnNumber--;
                    scope.play.setRollNumber(savedState.rollNumber);
                    scope.play.setIsInputRequired(savedState.isInputRequired);
                }

                scope.cells[savedState.cellKey] = savedState.cell;
                updateAvailableCells();
            }

            function updateSavedState(cellKey) {
                // Try without copy also
                savedState = {
                    cellKey: cellKey,
                    cell: angular.copy(scope.cells[cellKey]),
                    rollNumber: angular.copy(scope.play.rollNumber),
                    isInputRequired: angular.copy(scope.play.isInputRequired)
                };
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
