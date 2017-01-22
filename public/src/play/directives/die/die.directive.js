(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .directive('die', die);
    
    die.$inject = ['diceService'];
    function die(diceService) {
        return {
            link: link,
            templateUrl: 'src/play/directives/die/die.html',
            replace: true,
            scope: true
        };

        function link(scope, elem, attrs) {
            scope.die = {
                isLocked: false,
                value: getRandomValue()
            };

            diceService.dice[attrs.i] = scope.die;

            scope.$on('roll', randomizeValue);

            function randomizeValue() {
                if (!scope.die.isLocked) {
                    scope.die.value = getRandomValue();
                }
            }

            function getRandomValue() {
                return Math.round(Math.random() * 5 + 1);
            }
        }
    }
})();
