(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard')
        .controller('LeaderboardCtrl', LeaderboardCtrl);
    
    LeaderboardCtrl.$inject = ['users', '$scope', 'helperService'];
    function LeaderboardCtrl(users, $scope, helperService) {
        var vm = this;

        activate();

        vm.setSelected = setSelected;

        function activate() {
            vm.options = {
                dice: helperService.getDiceOptions(),
                type: helperService.getTypeOptions('leaderboard')
            };

            $scope.$watchGroup([
                'leaderboard.selected.dice',
                'leaderboard.selected.type'
            ], onSelectedChanged);

            vm.selected = {
                dice: vm.options.dice[0],
                type: vm.options.type[0]
            };

            function onSelectedChanged() {
                //
            }
        }

        function setSelected(key, item) {
            vm.selected[key] = item;
        }
    }
})();