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

            initCells();

            $scope.$on('roll', updateAvailableCells);

            function initCells() {
                $scope.cells = {};
                iterateRowsAndColumns(initCell, true);

                function initCell(cellKey) {
                    $scope.cells[cellKey] = {
                        available: false,
                        value: null
                    };
                }
            }

            function updateAvailableCells() {
                getAvailableCells().forEach(setCellToAvailable);
                
                function getAvailableCells() {
                    return [];
                }

                function setCellToAvailable(cellKey) {
                    $scope.cells[cellKey].available = true;
                }
            }

            function iterateRowsAndColumns(functionToCall, callWithCellKey) {
                rows.forEach(function(row) {
                    columns.forEach(function(column) {
                        if (callWithCellKey) {
                            var cellKey = row.abbreviation + '_' + column.abbreviation;
                            functionToCall(cellKey);
                        } else {
                            functionToCall(row, column);
                        }
                    });
                });
            }
        }
    }
})();
