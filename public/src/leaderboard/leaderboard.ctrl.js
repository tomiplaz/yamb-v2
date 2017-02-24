(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard')
        .controller('LeaderboardCtrl', LeaderboardCtrl);
    
    LeaderboardCtrl.$inject = ['users', '$scope', 'helperService', 'apiService', 'modalService'];
    function LeaderboardCtrl(users, $scope, helperService, apiService, modalService) {
        var vm = this;

        activate();

        vm.setSelected = setSelected;
        vm.userClicked = userClicked;
        vm.bestResultClicked = bestResultClicked;

        function activate() {
            vm.options = {
                dice: helperService.getDiceOptions(),
                type: helperService.getTypeOptions('leaderboard')
            };

            vm.users = users;

            $scope.$watchGroup([
                'leaderboard.selected.dice',
                'leaderboard.selected.type'
            ], onSelectedChanged);

            vm.selected = {
                dice: vm.options.dice[0],
                type: vm.options.type[0]
            };

            function onSelectedChanged() {
                vm.orderByPredicate = getOrderByPredicate(
                    vm.selected.type.key,
                    vm.selected.dice.key
                );

                function getOrderByPredicate() {
                    var args = arguments;

                    return function(item) {
                        return item[args[0]][args[1]];
                    }
                }
            }
        }

        function setSelected(key, item) {
            vm.selected[key] = item;
        }

        function userClicked(user) {
            var modal = modalService.getModalInstance(
                modalService.MODALS.USER_INFO,
                {user: user}
            );
        }

        function bestResultClicked(user, diceKey) {
            if (vm.selected.type.key === 'best_results') {
                var modal = modalService.getModalInstance(
                    modalService.MODALS.GAME_INFO,
                    {user: user, diceKey: diceKey}
                );
            }
        }
    }
})();