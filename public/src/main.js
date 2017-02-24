(function() {
    'use strict';

    angular
        .module('yamb-v2', [
            'ui.router',
            'ui.bootstrap',
            'ngAnimate',
            'ngTouch',
            'angular-jwt',
            'ngStorage',
            'toastr',
            'commonServices',
            'yamb-v2.services',
            'yamb-v2.filters',
            'yamb-v2.root',
            'yamb-v2.home',
            'yamb-v2.register',
            'yamb-v2.login',
            'yamb-v2.play',
            'yamb-v2.statistics',
            'yamb-v2.leaderboard',
            'yamb-v2.rules'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$locationProvider']
    function config($locationProvider) {        
        $locationProvider.html5Mode(true);
    }

    run.$inject = ['$state'];
    function run($state) {
        $state.go('root.home');
    }
})();