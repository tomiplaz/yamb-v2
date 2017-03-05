(function() {
    'use strict';

    angular
        .module('yamb-v2.filters')
        .filter('formatValue', formatValue);
    
    function formatValue() {
        return function(value, key) {
            switch (key) {
                case 'duration':
                case 'average_duration':
                    if (typeof value !== 'number' || isNaN(value) || value === 0) {
                        return '-';
                    } else {
                        var seconds = Math.floor(value / 1000);
                        var minutes = Math.floor(seconds / 60);
                        return formatTimeValue(minutes) + ':' + formatTimeValue(seconds - minutes * 60);
                    }
                case 'games_played':
                case 'games_unfinished':
                    return value;
                default:
                    return (value ? value : '-');
            }

            function formatTimeValue(value) {
                if (value < 10) {
                    return '0' + value;
                } else {
                    return value;
                }
            }
        };
    }
})();