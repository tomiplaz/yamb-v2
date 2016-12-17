(function() {
    'use strict';

    angular
        .module('yamb-v2')
        .factory('auth', auth);

    auth.$inject = ['Restangular'];
    function auth(Restangular) {
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