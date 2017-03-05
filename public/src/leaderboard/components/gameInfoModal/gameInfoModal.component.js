(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard')
        .component('gameInfoModal', {
            templateUrl: 'src/leaderboard/components/gameInfoModal/gameInfoModal.component.html',
            bindings: {
                resolve: '<'
            },
            controller: controller
        });
    
    function controller() {
        var $ctrl = this;

        $ctrl.$onInit = onInit;

        function onInit() {
            $ctrl.user = $ctrl.resolve.user;
            $ctrl.cells = {};

            if ($ctrl.resolve.bestGames) {
                $ctrl.game = $ctrl.resolve.bestGames[$ctrl.resolve.diceKey];
            } else {
                $ctrl.game = $ctrl.resolve.game;
            }
            
            $ctrl.game.cells.forEach(setCellProperty);

            function setCellProperty(cell) {
                $ctrl.cells[cell.cell_key] = {
                    value: cell.value
                };
            }
        }
    }
})();