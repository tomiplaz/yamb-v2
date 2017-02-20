(function() {
    'use strict';

    angular
        .module('yamb-v2.statistics')
        .controller('StatisticsCtrl', StatisticsCtrl);
    
    StatisticsCtrl.$inject = ['worldwide', 'personal', '$scope', 'helperService'];
    function StatisticsCtrl(worldwide, personal, $scope, helperService) {
        var vm = this;

        activate();

        vm.setSelected = setSelected;
        vm.formatDuration = helperService.formatDuration;

        function activate() {
            vm.options = {
                dice: getDiceOptions(),
                scope: getScopeOptions(),
                type: getTypeOptions()
            };

            vm.cells = null;
            vm.other = null;

            vm.worldwide = worldwide;
            vm.personal = personal;

            $scope.$watchGroup([
                'statistics.selected.dice',
                'statistics.selected.scope',
                'statistics.selected.type'
            ], onSelectedChanged);

            vm.selected = {
                dice: vm.options.dice[0],
                scope: vm.options.scope[0],
                type: vm.options.type[0]
            };

            function getDiceOptions() {
                return ['5', '6'].map(mapDiceOption);

                function mapDiceOption(item) {
                    return {
                        key: item + '_dice',
                        label: item + ' Dice'
                    };
                }
            }

            function getScopeOptions() {
                return ['Worldwide', 'Personal'].map(mapItem);
            }

            function getTypeOptions() {
                return ['Value', 'Input Turn', 'Other'].map(mapItem);
            }

            function mapItem(item) {
                return {
                    key: item.toLowerCase().replace(' ', '_'),
                    label: item
                };
            }

            function onSelectedChanged(newSelected) {
                if (vm.selected.type.key === 'other') {
                    vm.cells = null;
                    vm.other = vm[vm.selected.scope.key].other_stats;
                } else {
                    vm.other = null;
                    vm.cells = vm[vm.selected.scope.key].cells_averages[vm.selected.dice.key];
                }
            }
        }

        function setSelected(key, item) {
            vm.selected[key] = item;
        }
    }
})();