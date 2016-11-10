(function() {
    'use strict';

    angular
        .module('yamb-v2', ['ui.router', 'restangular'])
        .config(config)
        .run(run);
    
    config.$inject = ['$stateProvider', 'RestangularProvider']
    function config($stateProvider, RestangularProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home.html',
                controller: 'HomeCtrl as home'
            });

        RestangularProvider
            .setBaseUrl('api/v1');
    }

    run.$inject = ['$state'];
    function run($state) {
        $state.go('home');
    }
})();