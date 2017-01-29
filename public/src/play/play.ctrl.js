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
        vm.resetRollNumber = resetRollNumber;
        vm.setIsInputRequired = setIsInputRequired;
        vm.saveGame = saveGame;

        function activate() {
            vm.columns = columns.plain();
            vm.rows = rows.plain();
            vm.hasGameStarted = false;
            vm.rollNumber = 0;
            vm.isInputRequired = false;
            vm.isFinished = false;
        }

        function start() {
            vm.hasGameStarted = true;
            $scope.$broadcast('start');
            roll();
        }
        
        function roll() {
            incrementRollNumber();
            $scope.$broadcast('roll');

            if (vm.rollNumber === 3) {
                vm.isInputRequired = true;
            }
        }

        function incrementRollNumber() {
            ++vm.rollNumber;
        }

        function resetRollNumber() {
            vm.rollNumber = 0;
        }

        function setIsInputRequired(value) {
            vm.isInputRequired = value;
        }

        function saveGame(cells, finalResult) {
            vm.isFinished = true;
            console.log(cells, finalResult, $scope.timer);
        }
    }
})();
