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
            vm.scopes = getScopes();
            vm.types = getTypes();

            vm.cells = null;
            vm.other = null;

            vm.worldwide = worldwide;
            vm.personal = personal;

            $scope.$watchGroup(['statistics.selected.scope', 'statistics.selected.type'], onSelectedChanged);

            vm.selected = {
                scope: vm.scopes[0],
                type: vm.types[0]
            };

            function getScopes() {
                return ['Worldwide', 'Personal'].map(mapItem);
            }

            function getTypes() {
                return ['Values', 'Turns', 'Other'].map(mapItem);
            }

            function mapItem(item) {
                return {
                    key: item.toLowerCase(),
                    label: item
                };
            }

            function onSelectedChanged(newSelected) {
                if (vm.selected.type.key === 'other') {
                    vm.cells = null;
                    vm.other = vm[vm.selected.scope.key].otherStats;
                } else {
                    vm.other = null;
                    vm.cellDisplayProperty = getCellDisplayProperty(vm.selected.type.key);
                    vm.cells = vm[vm.selected.scope.key].cellsAverages;
                }

                function getCellDisplayProperty(key) {
                    if (key === 'turns') {
                        return 'averageInputTurn';
                    } else {
                        return 'averageValue';
                    }
                }
            }
        }

        function setSelected(key, index) {
            vm.selected[key] = vm[key + 's'][index];
        }
    }
})();