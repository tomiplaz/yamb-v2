(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .factory('diceService', diceService);
    
    function diceService() {
        var service = {
            dice: {},
            getDice: getDice,
            getDiceValues: getDiceValues,
            unlockAndDisableDice: unlockAndDisableDice
        }

        return service;

        function getDice() {
            return service.dice;
        }

        function getDiceValues() {
            var diceValues = [];

            for (var i in service.dice) {
                diceValues.push(service.dice[i].value);
            }

            return diceValues;
        }

        function unlockAndDisableDice() {
            for (var i in service.dice) {
                service.dice[i].isLocked = false;
                service.dice[i].isDisabled = true;
            }
        }
    }
})();
