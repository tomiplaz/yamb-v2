(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .factory('diceService', diceService);
    
    function diceService() {
        var service = {
            dice: [],
            getDice: getDice,
            getDiceValues: getDiceValues,
            unlockAndDisableDice: unlockAndDisableDice,
            enableDice: enableDice
        };

        return service;

        function getDice() {
            return service.dice;
        }

        function getDiceValues() {
            return service.dice.map(dieValue);

            function dieValue(die) {
                return die.value;
            }
        }

        function unlockAndDisableDice() {
            service.dice.forEach(unlockAndDisableDie);

            function unlockAndDisableDie(die) {
                die.isLocked = false;
                die.isDisabled = true;
            }
        }

        function enableDice() {
            service.dice.forEach(enableDie);

            function enableDie(die) {
                die.isDisabled = false;
            }
        }
    }
})();
