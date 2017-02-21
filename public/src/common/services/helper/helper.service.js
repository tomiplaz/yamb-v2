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
            return getOptions(state);

            function getOptions(state) {
                if (state === 'statistics') {
                    return ['Value', 'Input Turn', 'Other'].map(mapItem);
                } else if (state === 'leaderboard') {
                    return ['Best', 'Average', 'Played'].map(mapLeaderboardTypeOption);
                } else {
                    return [];
                }
            }

            function mapLeaderboardTypeOption(item) {
                return {
                    key: getKeyLabel(item).toLowerCase().replace(' ', '_'),
                    label: item,
                };

                function getKeyLabel(item) {
                    if (item === 'Played') {
                        return ('Games ' + item)
                    } else {
                        return (item + ' Results')
                    }
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