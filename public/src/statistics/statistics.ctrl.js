(function() {
    'use strict';

    angular
        .module('yamb-v2.statistics')
        .controller('StatisticsCtrl', StatisticsCtrl);
    
    StatisticsCtrl.$inject = ['worldwide', 'personal', 'helperService'];
    function StatisticsCtrl(worldwide, personal, helperService) {
        var vm = this;

        activate();

        vm.setSelected = setSelected;

        function activate() {
            vm.options = {
                dice: helperService.getDiceOptions(),
                scope: helperService.getScopeOptions(),
                type: helperService.getTypeOptions('statistics')
            };

            vm.cells = null;
            vm.other = null;

            vm.worldwide = worldwide;
            vm.personal = personal;

            vm.selected = {
                dice: vm.options.dice[0],
                scope: vm.options.scope[0],
                type: vm.options.type[0]
            };

            onSelectedChanged();
        }

        function onSelectedChanged() {
            if (vm.selected.type.key === 'other') {
                vm.cells = null;
                vm.other = vm[vm.selected.scope.key].other_stats;
            } else {
                vm.other = null;
                vm.cells = vm[vm.selected.scope.key].cells_averages[vm.selected.dice.key];
            }
        }

        function setSelected(key, item) {
            vm.selected[key] = item;
            onSelectedChanged();
        }
    }
})();