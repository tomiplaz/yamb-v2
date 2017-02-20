(function() {
    'use strict';

    angular
        .module('yamb-v2.statistics')
        .directive('paperStatic', paperStatic);
    
    paperStatic.$inject = ['$rootScope'];
    function paperStatic($rootScope) {
        return {
            link: link,
            templateUrl: 'src/statistics/directives/paperStatic/paperStatic.html',
            replace: true,
            scope: {
                cells: '=',
                key: '='
            }
        };

        function link(scope) {
            scope.rows = $rootScope.rows;
            scope.columns = $rootScope.columns;
            
            scope.isPlayable = isPlayable;

            function isPlayable(row) {
                return row.abbreviation.indexOf('sum') === -1;
            }
        }
    }
})();
