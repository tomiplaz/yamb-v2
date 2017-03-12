(function() {
    'use strict';

    angular
        .module('yamb-v2.root')
        .controller('RootCtrl', RootCtrl);
    
    RootCtrl.$inject = ['rows', 'columns', 'user', '$localStorage', '$state', '$rootScope'];
    function RootCtrl(rows, columns, user, $localStorage, $state, $rootScope) {
        var vm = this;

        activate();

        vm.logout = logout;

        function activate() {
            $rootScope.user = (user ? user.plain() : user);
            $rootScope.rows = rows.plain();
            $rootScope.columns = columns.plain();

            vm.isNavCollapsed = true;

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
                },
                {
                    name: 'root.about',
                    label: 'About'
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
        }

        function logout() {
            delete $localStorage.token;
            $rootScope.user = null;
            vm.isNavCollapsed = true;
            $state.go('root.home');
        }
    }
})();