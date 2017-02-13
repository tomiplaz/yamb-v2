(function() {
    'use strict';

    angular
        .module('yamb-v2.root')
        .controller('RootCtrl', RootCtrl);
    
    RootCtrl.$inject = ['userService', '$localStorage', '$state', '$rootScope'];
    function RootCtrl(userService, $localStorage, $state, $rootScope) {
        var vm = this;

        activate();

        vm.logout = logout;

        function activate() {
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
                },
                {
                    name: 'root.login',
                    label: 'Login'
                }
            ];

            userService.updateUser();
        }

        function logout() {
            delete $localStorage.token;
            $rootScope.user = null;
            $state.go('root.home');
        }
    }
})();