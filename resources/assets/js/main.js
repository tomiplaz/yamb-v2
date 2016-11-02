(function() {
    'use strict';

    angular
        .module('yamb-v2', ['ui.router'])
        .controller('HomeCtrl', HomeCtrl)
        .config(config)
        .run(run);

    HomeCtrl.$inject = ['$state'];
    function HomeCtrl($state) {
        var vm = this;

        console.log($state.current.name);
    }
    
    config.$inject = ['$stateProvider']
    function config($stateProvider) {
        $stateProvider.state('home', {
            url: '/',
            template: 'Home',
            controller: 'HomeCtrl as home'
        });
    }

    run.$inject = ['$state'];
    function run($state) {
        $state.go('home');
    }
})();