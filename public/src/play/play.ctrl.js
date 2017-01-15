(function() {
    'use strict';

    angular
        .module('yamb-v2.play', [])
        .controller('PlayCtrl', PlayCtrl);

    PlayCtrl.$inject = ['columns', 'rows', '$interval', '$scope'];
    function PlayCtrl(columns, rows, $interval, $scope) {
        var vm = this;

        activate();

        vm.start = start;
        vm.roll = roll;

        function activate() {
            vm.columns = columns.plain();
            vm.rows = rows.plain();
            vm.isGameStarted = false;
            vm.rollNumber = 0;
        }

        function start() {
            vm.isGameStarted = true;
            $scope.$broadcast('start');
            roll();
        }
        
        function roll() {
            $scope.$broadcast('roll');
            incrementRollNumber();
        }

        function incrementRollNumber() {
            ++vm.rollNumber;
        }

        function resetRollNumber() {
            vm.rollNumber = 0;
        }
    }
})();
