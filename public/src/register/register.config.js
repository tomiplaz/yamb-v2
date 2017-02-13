(function() {
    'use strict';

    angular
        .module('yamb-v2.register', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.register', {
                url: 'register',
                templateUrl: 'src/register/register.html',
                controller: 'RegisterCtrl as register'
            });
    }
})();