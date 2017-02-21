(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard')
        .controller('LeaderboardCtrl', LeaderboardCtrl);
    
    LeaderboardCtrl.$inject = ['users', '$scope', 'helperService', '$uibModal', 'apiService'];
    function LeaderboardCtrl(users, $scope, helperService, $uibModal, apiService) {
        var vm = this;

        activate();

        vm.setSelected = setSelected;
        vm.userClicked = userClicked;

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
            var modalInstance = $uibModal.open({
                animation: true,
                component: 'userInfoModal',
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });

            modalInstance.result.then(function() {
                //
            }, function() {

            });
        }
    }
})();