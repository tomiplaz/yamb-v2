(function() {
    'use strict';

    angular
        .module('yamb-v2.play', [])
        .controller('PlayCtrl', PlayCtrl);

    PlayCtrl.$inject = ['columns', 'rows'];
    function PlayCtrl(columns, rows) {
        var vm = this;

        activate();

        function activate() {
            vm.columns = columns;
            vm.rows = rows;

            vm.bla = {
                red: true
            };
        }
    }
})();