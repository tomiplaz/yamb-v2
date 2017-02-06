(function() {
    'use strict';

    angular
        .module('services.auth', ['restangular'])
        .factory('authService', authService);

    authService.$inject = ['Restangular'];
    function authService(Restangular) {
        return {
            register: register,
            login: login
        }

        function register(data) {
            return Restangular.all('register').post(data);
        }

        function login(data) {
            return Restangular.all('login').post(data);
        }
    }
})();