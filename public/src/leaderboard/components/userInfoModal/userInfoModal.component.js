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
    
    controller.$inject = ['helperService'];
    function controller(helperService) {
        var $ctrl = this;

        $ctrl.$onInit = onInit;
        $ctrl.setSelectedDiceOption = setSelectedDiceOption;

        function onInit() {
            $ctrl.statKeys = helperService.getStatKeys();
            $ctrl.diceOptions = helperService.getDiceOptions();

            $ctrl.user = $ctrl.resolve.user;

            setSelectedDiceOption($ctrl.diceOptions[0]);
        }

        function setSelectedDiceOption(diceOption) {
            $ctrl.selectedDiceOption = diceOption;
        }
    }
})();