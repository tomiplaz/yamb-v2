(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard')
        .component('userInfoModal', {
            templateUrl: 'src/leaderboard/components/userInfoModal/userInfoModal.component.html',
            bindings: {
                resolve: '<'
            },
            controller: controller
        });
    
    controller.$inject = ['helperService', '$scope']
    function controller(helperService, $scope) {
        var $ctrl = this;

        $ctrl.$onInit = onInit;
        $ctrl.setSelected = setSelected;

        function onInit() {
            $ctrl.statKeys = helperService.getStatKeys();
            $ctrl.diceOptions = helperService.getDiceOptions();

            $ctrl.user = $ctrl.resolve.user;

            $scope.$watchGroup(watchSelectedDiceOption, onSelectedChanged);

            $ctrl.selectedDiceOption = $ctrl.diceOptions[0];

            function watchSelectedDiceOption() {
                return $ctrl.selectedDiceOption;
            }

            function onSelectedChanged() {

            }
        }

        function setSelected(diceOption) {
            $ctrl.selectedDiceOption = diceOption;
        }
    }
})();