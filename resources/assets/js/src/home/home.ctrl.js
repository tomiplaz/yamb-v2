(function() {
    'use strict';

    angular
        .module('yamb-v2')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = [];
    function HomeCtrl() {
        var vm = this;

        vm.title = "This is home";
    }
})();