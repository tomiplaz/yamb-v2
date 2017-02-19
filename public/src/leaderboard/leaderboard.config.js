(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.leaderboard', {
                url: 'leaderboard',
                templateUrl: 'src/leaderboard/leaderboard.html',
                controller: 'LeaderboardCtrl as leaderboard',
                resolve: {
                    users: function(apiService) {
                        return apiService.get('users');
                    }
                }
            });
    }
})();