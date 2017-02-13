(function() {
    'use strict';

    angular
        .module('yamb-v2.play', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.play', {
                url: 'play',
                templateUrl: 'src/play/play.html',
                controller: 'PlayCtrl as play',
                resolve: {
                    columns: function(apiService) {
                        return apiService.get('columns');
                    },
                    rows: function(apiService) {
                        return apiService.get('rows');
                    }
                }
            });
    }
})();