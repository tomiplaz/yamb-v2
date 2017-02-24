(function() {
    'use strict';

    angular
        .module('yamb-v2.filters')
        .filter('formatDuration', formatDuration);
    
    function formatDuration() {
        return function(miliseconds) {
            if (typeof miliseconds !== 'number' || isNaN(miliseconds)) {
                return '-';
            } else {
                var seconds = Math.floor(miliseconds / 1000);
                var minutes = Math.floor(seconds / 60);
                return minutes + ':' + (seconds - minutes * 60);
            }
        };
    }
})();