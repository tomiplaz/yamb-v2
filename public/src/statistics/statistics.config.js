(function() {
    'use strict';

    angular
        .module('yamb-v2.statistics', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.statistics', {
                url: 'statistics',
                templateUrl: 'src/statistics/statistics.html',
                controller: 'StatisticsCtrl as statistics',
                resolve: {
                    cellsAverages: function(apiService) {
                        return apiService.custom('statistics', null, 'get', 'cells-averages');
                    }
                }
            });
    }
})();