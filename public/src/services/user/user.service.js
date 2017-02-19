(function() {
    'use strict';

    angular
        .module('services.user', ['angular-jwt'])
        .factory('userService', userService);
    
    userService.$inject = ['$localStorage', 'jwtHelper', 'apiService', '$rootScope'];
    function userService($localStorage, jwtHelper, apiService, $rootScope) {
        return {
            getUserId: getUserId,
            getUser: getUser
        };

        function getUserId() {
            if ($localStorage.token) {
                var decodedToken = jwtHelper.decodeToken($localStorage.token);
                return parseInt(decodedToken.sub);
            } else {
                return null;
            }
        }

        function getUser() {
            if ($localStorage.token) {
                var decodedToken = jwtHelper.decodeToken($localStorage.token);
                return apiService.get('users', decodedToken.sub);
            } else {
                return null;
            }
        }
    }
})();