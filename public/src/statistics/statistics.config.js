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
                    worldwide: function(apiService) {
                        return apiService.get('statistics');
                    },
                    personal: function(apiService, userService) {
                        var userId = userService.getUserId();
                        if (userId) {
                            return apiService.get('statistics', userId);
                        } else {
                            return null;
                        }
                    }
                }
            });
    }
})();