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
            getTypeOptions: getTypeOptions,
            getStatKeys: getStatKeys
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

        function getStatKeys() {
            var labels = [
                'Last game', 'Best result', 'Average result', 'Average duration', 'Games played'/*, 'Unfinished games'*/
            ];

            return labels.map(mapStatKey);

            function mapStatKey(label) {
                return {
                    key: getKey(label),
                    label: label
                };

                function getKey(label) {
                    if (label.indexOf('Last') !== -1) {
                        label += '_timestamp';
                    }
                    if (label.indexOf('result') !== -1) {
                        label += 's';
                    }

                    return label.replace(' ', '_').toLowerCase();
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