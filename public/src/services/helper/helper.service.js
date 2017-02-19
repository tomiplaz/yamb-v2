(function() {
    'use strict';

    angular
        .module('services.helper', [])
        .factory('helperService', helperService);
    
    helperService.$inject = [];
    function helperService() {
        return {
            formatDuration: formatDuration
        };

        function formatDuration(miliseconds) {
            console.log(miliseconds);
            if (!miliseconds) {
                return '-:-';
            } else {
                var seconds = Math.floor(miliseconds / 1000);
                var minutes = Math.floor(seconds / 60);
                return minutes + ':' + (seconds - minutes * 60);
            }
        }
    }
})();