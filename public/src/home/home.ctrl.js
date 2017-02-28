(function() {
    'use strict';

    angular
        .module('yamb-v2.home')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['lastGame'];
    function HomeCtrl(lastGame) {
        var vm = this;

        vm.lastGame = (lastGame ? lastGame.plain() : lastGame);
    }
})();