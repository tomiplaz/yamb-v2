(function() {
    'use strict';

    angular
        .module('yamb-v2.play', [])
        .controller('PlayCtrl', PlayCtrl);

    PlayCtrl.$inject = ['columns', 'rows', '$interval', '$scope'];
    function PlayCtrl(columns, rows, $interval, $scope) {
        var vm = this;

        var startTime, timerInterval, timeDiff, days, hours, minutes, seconds, miliseconds;

        activate();

        vm.start = start;
        vm.roll = roll;

        function activate() {
            vm.columns = columns;
            vm.rows = rows;

            vm.timerDisplay = "00:00";
            vm.isGameStarted = false;
        }

        function start() {
            startTime = Date.now();
            timerInterval = $interval(updateTimer, 1);

            vm.isGameStarted = true;
        }
        
        function roll() {
            $scope.$broadcast('roll');
            //$interval.cancel(timerInterval);
        }

        function updateTimer() {
            timeDiff = Date.now() - startTime;
            days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
            hours = Math.floor((timeDiff - days * 24 * 60 * 60 * 1000) / 1000 / 60 / 60);
            minutes = Math.floor((timeDiff - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000) / 1000 / 60);
            seconds = Math.floor((timeDiff - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000);
            miliseconds = timeDiff - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000;

            vm.timerDisplay = formatTimerValue(minutes) + ":" + formatTimerValue(seconds);

            function formatTimerValue(value) {
                return (value < 10 ? "0" + value : value);
            }
        }
    }
})();
