(function() {
    'use strict';

    angular
        .module('yamb-v2.statistics')
        .controller('StatisticsCtrl', StatisticsCtrl);
    
    StatisticsCtrl.$inject = ['cellsAverages'];
    function StatisticsCtrl(cellsAverages) {
        var vm = this;

        vm.cellsAverages = cellsAverages.plain();
    }
})();