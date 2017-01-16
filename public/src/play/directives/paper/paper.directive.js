(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .directive('paper', paper);
    
    paper.$inject = [];
    function paper() {
        return {
            link: link,
            templateUrl: 'src/play/directives/paper/paper.html',
            replace: true,
            scope: true
        };

        function link($scope, elem, attrs) {
            var rows = $scope.play.rows;
            var columns = $scope.play.columns;
            var playableRows = rows.filter(isPlayable);

            initCells();

            $scope.$on('roll', updateAvailableCells);

            function initCells() {
                $scope.cells = {};
                iterateCells(initCell, false);

                function initCell(cellKey) {
                    $scope.cells[cellKey] = {
                        available: false,
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
                        $scope.cells[cellKey].available = false;
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
                                if ($scope.play.rollNumber === 1) {
                                    availableCellsKeys.push(cellKey);
                                    return;
                                }
                            default:
                                return;
                        }

                        function isCellEmpty(cellKey) {
                            return ($scope.cells[cellKey].value === null);
                        }

                        function getPlayableCellKey(rowIndex, columnIndex) {
                            console.log(rowIndex, columnIndex);
                            return playableRows[rowIndex].abbreviation + '_' + columns[columnIndex].abbreviation;
                        }
                    }
                }

                function setCellToAvailable(cellKey) {
                    $scope.cells[cellKey].available = true;
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
