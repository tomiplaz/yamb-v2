(function() {
    'use strict';

    angular
        .module('yamb-v2.root', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root', {
                url: '/',
                abstract: true,
                templateUrl: 'src/root/root.html',
                controller: 'RootCtrl as root',
                resolve: {
                    rows: function(apiService) {
                        return apiService.get('rows');
                    },
                    columns: function(apiService) {
                        return apiService.get('columns');
                    }
                }
            });
    }
})();