(function() {
    'use strict';

    angular
        .module('yamb-v2', [
            'ui.router',
            'angular-jwt',
            'ngStorage',
            'toastr',
            'services',
            'yamb-v2.home',
            'yamb-v2.register',
            'yamb-v2.login',
            'yamb-v2.users',
            'yamb-v2.play'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$locationProvider']
    function config($stateProvider, $locationProvider) {
        $stateProvider
            .state('root', {
                url: '/',
                abstract: true,
                template: '<div ui-view></div>',
                resolve: {
                    user: function($localStorage, jwtHelper, apiService, userService) {
                        if ($localStorage.token) {
                            var decodedToken = jwtHelper.decodeToken($localStorage.token);

                            return apiService
                                .get('users', decodedToken.sub)
                                .then(successCallback, errorCallback);
                            
                            function successCallback(response) {
                                userService.user = response.plain();
                                return userService.user;
                            }

                            function errorCallback(response) {
                                console.log("Error fetching user.");
                                return userService.user;
                            }
                        } else {
                            return null;
                        }
                    }
                }
            })
            .state('root.home', {
                url: 'home',
                templateUrl: 'src/home/home.html',
                controller: 'HomeCtrl as home'
            })
            .state('root.register', {
                url: 'register',
                templateUrl: 'src/register/register.html',
                controller: 'RegisterCtrl as register'
            })
            .state('root.login', {
                url: 'login',
                templateUrl: 'src/login/login.html',
                controller: 'LoginCtrl as login'
            })
            .state('root.users', {
                url: 'users',
                templateUrl: 'src/users/users.html',
                controller: 'UsersCtrl as users',
                resolve: {
                    users: function(apiService) {
                        return apiService.get('users');
                    }
                }
            })
            .state('root.play', {
                url: 'play',
                templateUrl: 'src/play/play.html',
                controller: 'PlayCtrl as play',
                resolve: {
                    columns: function(apiService) {
                        return apiService.get('columns');
                    },
                    rows: function(apiService) {
                        return apiService.get('rows');
                    }
                }
            });
        
        $locationProvider.html5Mode(true);
    }

    run.$inject = ['$state'];
    function run($state) {
        $state.go('root.home');
    }
})();