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
                $ctrl.game.cells.forEach(setCellProperty);
            } else {
                $ctrl.game = $ctrl.resolve.recentGame;
                $ctrl.cells = $ctrl.game.cells;
                $ctrl.isRecentGame = true;
            }
            
            function setCellProperty(cell) {
                $ctrl.cells[cell.cell_key] = {
                    value: cell.value
                };
            }
        }
    }
})();