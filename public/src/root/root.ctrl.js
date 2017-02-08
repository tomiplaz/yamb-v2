(function() {
    'use strict';

    angular
        .module('yamb-v2.root', [])
        .controller('RootCtrl', RootCtrl);
    
    function RootCtrl() {
        var vm = this;

        activate();

        function activate() {
            vm.states = [            
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
                    name: 'root.register',
                    label: 'Register'
                },
                {
                    name: 'root.login',
                    label: 'Login'
                }
            ];
        }
    }
})();