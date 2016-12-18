(function() {
    'use strict';

    angular
        .module('yamb-v2', [
            'ui.router',
            'services',
            'yamb-v2.home',
            'yamb-v2.register',
            'yamb-v2.login',
            'yamb-v2.users'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$locationProvider']
    function config($stateProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'src/home/home.html',
                controller: 'HomeCtrl as home'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'src/register/register.html',
                controller: 'RegisterCtrl as register'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'src/login/login.html',
                controller: 'LoginCtrl as login'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'src/users/users.html',
                controller: 'UsersCtrl as users',
                resolve: {
                    users: function(api) {
                        return api.get('users');
                    }
                }
            })
        
        $locationProvider.html5Mode(true);
    }

    run.$inject = ['$state'];
    function run($state) {
        $state.go('register');
    }
})();