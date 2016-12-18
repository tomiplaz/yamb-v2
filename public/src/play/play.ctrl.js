(function() {
'use strict';

    angular
        .module('yamb-v2.play')
        .controller('PlayCtrl', PlayCtrl);

    ControllerController.$inject = ['cols', 'rows'];
    function ControllerController(cols, rows) {
        var vm = this;

        activate();

        function activate() {
            vm.cols = cols;
            vm.rows = rows;
        }
    }
})();