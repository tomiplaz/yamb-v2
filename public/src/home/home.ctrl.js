(function() {
    'use strict';

    angular
        .module('yamb-v2.home', [])
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = [];
    function HomeCtrl() {
        var vm = this;

        vm.states = [
            {
                name: 'login',
                label: 'Login'
            },
            {
                name: 'register',
                label: 'Register'
            },
            {
                name: 'play',
                label: 'Play'
            },
            {
                name: 'users',
                label: 'Users'
            }
        ];
    }
})();