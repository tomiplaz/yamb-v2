(function() {
    'use strict';

    angular
        .module('yamb-v2.root', [])
        .controller('RootCtrl', RootCtrl);
    
    RootCtrl.$inject = ['userService', '$localStorage', '$state', '$scope'];
    function RootCtrl(userService, $localStorage, $state, $scope) {
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

            $scope.$watch(getUserServiceUser, updateVmUser);

            userService.updateUser();

            function getUserServiceUser() {
                return userService.user;
            }

            function updateVmUser(newVal) {
                vm.user = newVal;
            }
        }

        function logout() {
            delete $localStorage.token;
            userService.user = null;
            $state.go('root.home');
        }
    }
})();