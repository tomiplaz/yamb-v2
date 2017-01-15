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

            $scope.$on('roll', updateCells);

            function initCells() {
                $scope.cells = {};
                iterateRowsAndColumns(initCell);

                function initCell(row, column) {
                    $scope.cells[row.abbreviation + '_' + column.abbreviation] = {
                        available: false,
                        value: null
                    };
                }
            }

            function updateCells() {
                iterateRowsAndColumns(updateCell);

                function updateCell(row, column) {
                    $scope.cells[row.abbreviation + '_' + column.abbreviation] = {
                        available: false,
                        value: null
                    };
                }
            }

            function iterateRowsAndColumns(f) {
                rows.forEach(function(row) {
                    columns.forEach(function(column) {
                        f(row, column);
                    });
                });
            }
        }
    }
})();
