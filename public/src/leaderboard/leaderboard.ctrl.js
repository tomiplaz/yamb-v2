(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard')
        .controller('LeaderboardCtrl', LeaderboardCtrl);
    
    LeaderboardCtrl.$inject = ['users', '$scope', 'helperService'];
    function LeaderboardCtrl(worldwide, $scope, helperService) {
        var vm = this;

        activate();

        function activate() {
            vm.options = {
                dice: getDiceOptions(),
                types: getTypesOptions()
            };

            $scope.$watchGroup(['leaderboard.selected.dice', 'statistics.selected.type'], onSelectedChanged);

            vm.selected = {
                dice: vm.options.dice[0],
                type: vm.options.types[0]
            };

            function getDiceOptions() {
                return ['5 Dice', '6 Dice'].map(mapDiceOption);

                function mapDiceOption(item) {
                    return {};
                }
            }

            function getTypesOptions() {
                return ['Best', 'Average', 'Played'].map(mapTypeOption);

                function mapTypeOption(item) {
                    return {};
                }
            }
        }
    }
})();