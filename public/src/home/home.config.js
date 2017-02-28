(function() {
    'use strict';

    angular
        .module('yamb-v2.home', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.home', {
                url: 'home',
                templateUrl: 'src/home/home.html',
                controller: 'HomeCtrl as home',
                resolve: {
                    lastGame: function(apiService) {
                        return apiService.custom('games', null, 'get', 'last-game');
                    }
                }
            });
    }
})();