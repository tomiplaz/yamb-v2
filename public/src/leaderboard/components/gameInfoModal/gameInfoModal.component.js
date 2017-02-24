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
            var bestGames = $ctrl.resolve.bestGames.plain();

            $ctrl.user = $ctrl.resolve.user;
            $ctrl.game = bestGames[$ctrl.resolve.diceKey];
            $ctrl.cells = {};
            
            $ctrl.game.cells.forEach(setCellProperty);

            function setCellProperty(cell) {
                $ctrl.cells[cell.cell_key] = {
                    value: cell.value
                };
            }
        }
    }
})();