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
                name: 'root.login',
                label: 'Login'
            },
            {
                name: 'root.register',
                label: 'Register'
            },
            {
                name: 'root.play',
                label: 'Play'
            },
            {
                name: 'root.users',
                label: 'Users'
            }
        ];
    }
})();