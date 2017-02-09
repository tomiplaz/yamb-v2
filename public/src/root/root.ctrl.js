(function() {
    'use strict';

    angular
        .module('yamb-v2.root', [])
        .controller('RootCtrl', RootCtrl);
    
    RootCtrl.$inject = ['userService', '$localStorage', '$state'];
    function RootCtrl(userService, $localStorage, $state) {
        var vm = this;

        activate();

        vm.logout = logout;

        function activate() {
            vm.user = userService.user;
            vm.isUserLoggedIn = !!userService.user;
            vm.greeting = "Hello";

            vm.leftStates = [
                {
                    name: 'root.play',
                    label: 'Play'
                },
                {
                    name: 'root.rules',
                    label: 'Rules'
                },
                {
                    name: 'root.leaderboard',
                    label: 'Leaderboard'
                },
                {
                    name: 'root.statistics',
                    label: 'Statistics'
                }
            ];

            vm.rightStates = [
                {
                    name: 'root.register',
                    label: 'Register'
                }
            ];

            if (!vm.isUserLoggedIn) {
                vm.rightStates.push({
                    name: 'root.login',
                    label: 'Login'
                });
            }
        }

        function logout() {
            delete $localStorage.token;
            userService.user = null;
            $state.go('root.home');
        }
    }
})();