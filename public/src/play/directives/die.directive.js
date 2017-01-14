(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .directive('die', die);
    
    die.$inject = [];
    function die() {
        return {
            link: link,
            templateUrl: 'src/play/directives/die.html',
            replace: true,
            scope: true
        };

        function link(scope, elem, attrs) {
            scope.isLocked = false;
            scope.value = getRandomValue();

            scope.$on('roll', randomizeValue);

            function randomizeValue() {
                scope.value = getRandomValue();
            }

            function getRandomValue() {
                return Math.round(Math.random() * 5 + 1);
            }
        }
    }
})();