(function() {
    'use strict';

    angular
        .module('yamb-v2.rules', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.rules', {
                url: 'rules',
                templateUrl: 'src/rules/rules.html',
                controller: 'RulesCtrl as rules'
            });
    }
})();