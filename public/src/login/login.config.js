(function() {
    'use strict';

    angular
        .module('yamb-v2.login', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.login', {
                url: 'login',
                templateUrl: 'src/login/login.html',
                controller: 'LoginCtrl as login'
            });
    }
})();