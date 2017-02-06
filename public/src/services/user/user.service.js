(function() {
    'use strict';

    angular
        .module('services.user', ['angular-jwt'])
        .factory('userService', userService);
    
    userService.$inject = [];
    function userService() {
        return {
            user: null
        }
    }
})();