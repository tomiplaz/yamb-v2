(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .controller('PlayCtrl', PlayCtrl);

    PlayCtrl.$inject = ['columns', 'rows', '$interval', '$scope', 'apiService', '$rootScope', 'toastr'];
    function PlayCtrl(columns, rows, $interval, $scope, apiService, $rootScope, toastr) {
        var vm = this;

        activate();

        vm.startGame = startGame;
        vm.roll = roll;
        vm.resetRollNumber = resetRollNumber;
        vm.setIsInputRequired = setIsInputRequired;
        vm.setIsAnnouncementRequired = setIsAnnouncementRequired;
        vm.saveGame = saveGame;

        function activate() {
            vm.columns = columns.plain();
            vm.rows = rows.plain();
            vm.hasGameStarted = false;
            vm.rollNumber = 0;
            vm.isInputRequired = false;
            vm.isAnnouncementRequired = false;
            vm.isGameFinished = false;

            $scope.$on('$destroy', onDestroy);

            function onDestroy() {
                // Handle on refresh, close, etc...
                if ($rootScope.user && vm.hasGameStarted) {
                    apiService.custom('users', vm.$rootScope.id, 'post', 'increment-unfinished-games');
                }
            }
        }

        function startGame(numberOfDice) {
            vm.numberOfDice = numberOfDice;
            vm.diceIndices = getDiceIndices();

            vm.hasGameStarted = true;
            $scope.$broadcast('start');
            roll();
        }
        
        function roll() {
            incrementRollNumber();
            $scope.$broadcast('roll');

            if (vm.rollNumber === 3) {
                setIsInputRequired(true)
            }
        }

        function getDiceIndices() {
            var diceIndices = [];

            for (var i = 0; i < vm.numberOfDice; i++) {
                diceIndices.push(i);
            }

            return diceIndices;
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

        function setIsAnnouncementRequired(value) {
            vm.isAnnouncementRequired = value;
        }

        function saveGame(cells, finalResult) {
            vm.isGameFinished = true;
            vm.finalResult = finalResult;

            $scope.$broadcast('stop');

            var data = {
                game: {
                    user_id: ($rootScope.user ? $rootScope.user.id : null),
                    number_of_dice: vm.numberOfDice.toString(),
                    result: finalResult,
                    duration: $scope.timer.value
                },
                cells: getMappedCells(cells)
            };

            apiService
                .create('games', data)
                .then(successCallback, errorCallback);

            function getMappedCells(cells) {
                var mappedCells = [];

                for (var cellKey in cells) {
                    mappedCells.push({
                        row_id: cells[cellKey].row.id,
                        column_id: cells[cellKey].column.id,
                        value: cells[cellKey].value,
                        input_turn: cells[cellKey].inputTurn
                    });
                }

                return mappedCells;
            }

            function successCallback(response) {
                toastr.success("Game saved successfully!", "Game saved");
                // Hide paper, show result and how it stands on leaderboard
            }

            function errorCallback(response) {
                toastr.error(response, "Error");
            }
        }
    }
})();
