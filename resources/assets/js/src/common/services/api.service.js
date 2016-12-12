(function() {
    'use strict';

    angular
        .module('yamb-v2')
        .factory('api', api);
    
    api.$inject = ['Restangular'];
    function api(Restangular) {
        return {
            register: register,
            login: login
        }

        function register(data) {
            //return Restangular...
        }

        function login(data) {
            return Restangular.all()
        }
    }
})();