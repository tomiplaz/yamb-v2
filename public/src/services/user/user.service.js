(function() {
    'use strict';

    angular
        .module('services.user', ['angular-jwt'])
        .factory('userService', userService);
    
    userService.$inject = ['$localStorage', 'jwtHelper', 'apiService', '$rootScope'];
    function userService($localStorage, jwtHelper, apiService, $rootScope) {
        return {
            updateUser: updateUser
        };

        function updateUser() {
            if ($localStorage.token) {
                var decodedToken = jwtHelper.decodeToken($localStorage.token);

                return apiService
                    .get('users', decodedToken.sub)
                    .then(successCallback, errorCallback);
                
                function successCallback(response) {
                    $rootScope.user = response.plain();
                }

                function errorCallback(response) {
                    console.log("Error fetching user.");
                }
            }
        }
    }
})();