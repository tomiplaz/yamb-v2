(function() {
    'use strict';

    angular
        .module('yamb-v2.statistics')
        .directive('paperStatic', paperStatic);
    
    paperStatic.$inject = [];
    function paperStatic() {
        return {
            link: link,
            templateUrl: 'src/statistics/directives/paperStatic/paperStatic.html',
            replace: true,
            scope: true
        };

        function link(scope) {
            scope.cells = scope.statistics.cellsAverages;

            scope.isPlayable = isPlayable;

            function isPlayable(row) {
                return row.abbreviation.indexOf('sum') === -1;
            }
        }
    }
})();
