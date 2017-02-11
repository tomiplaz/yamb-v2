(function() {
    'use strict';

    angular
        .module('services.user', ['angular-jwt'])
        .factory('userService', userService);
    
    userService.$inject = ['$localStorage', 'jwtHelper', 'apiService'];
    function userService($localStorage, jwtHelper, apiService) {
        var service = {
            user: null,
            updateUser: updateUser
        };

        return service;

        function updateUser() {
            if ($localStorage.token) {
                var decodedToken = jwtHelper.decodeToken($localStorage.token);

                return apiService
                    .get('users', decodedToken.sub)
                    .then(successCallback, errorCallback);
                
                function successCallback(response) {
                    service.user = response.plain();
                }

                function errorCallback(response) {
                    console.log("Error fetching user.");
                }
            }
        }
    }
})();