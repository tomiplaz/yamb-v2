(function() {
    'use strict';

    angular
        .module('yamb-v2.services')
        .factory('helperService', helperService);
    
    helperService.$inject = [];
    function helperService() {
        return {
            getDiceOptions: getDiceOptions,
            getScopeOptions: getScopeOptions,
            getTypeOptions: getTypeOptions
        };

        function getDiceOptions() {
            return ['5', '6'].map(mapDiceOption);

            function mapDiceOption(item) {
                return {
                    key: item + '_dice',
                    label: item + ' Dice'
                };
            }
        }

        function getScopeOptions() {
            return ['Worldwide', 'Personal'].map(mapItem);
        }

        function getTypeOptions(state) {
            var options = getOptions(state);

            return options.map(mapItem);

            function getOptions(state) {
                if (state === 'statistics') {
                    return ['Value', 'Input Turn', 'Other'];
                } else if (state === 'leaderboard') {
                    return ['Best', 'Average', 'Played'];
                } else {
                    return [];
                }
            }
        }

        function mapItem(item) {
            return {
                key: item.toLowerCase().replace(' ', '_'),
                label: item
            };
        }
    }
})();