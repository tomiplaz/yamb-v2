(function() {
    'use strict';

    angular
        .module('yamb-v2.about', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.about', {
                url: 'about',
                templateUrl: 'src/about/about.html'
            });
    }
})();