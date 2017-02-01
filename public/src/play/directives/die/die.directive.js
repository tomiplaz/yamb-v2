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
                isDisabled: true,
                value: getRandomValue()
            };

            diceService.dice[parseInt(attrs.index)] = scope.die;

            scope.toggleDieLock = toggleDieLock;

            scope.$on('roll', rollHandler);

            function getRandomValue() {
                return Math.round(Math.random() * 5 + 1);
            }

            function toggleDieLock() {
                scope.die.isLocked = !scope.die.isLocked;
            }

            function rollHandler() {
                if (!scope.die.isLocked) {
                    scope.die.value = getRandomValue();
                }

                if (scope.play.rollNumber === 3) {
                    scope.die.isLocked = false;
                    scope.die.isDisabled = true;
                }

                if (scope.play.rollNumber === 1) {
                    scope.die.isDisabled = false;
                }
            }
        }
    }
})();
