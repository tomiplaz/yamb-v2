(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .controller('PlayCtrl', PlayCtrl);

    PlayCtrl.$inject = ['$scope', 'apiService', 'userService', 'toastr', 'helperService'];
    function PlayCtrl($scope, apiService, userService, toastr, helperService) {
        var vm = this;

        var userId = userService.getUserId();

        activate();

        vm.setSelectedDiceOption = setSelectedDiceOption;
        vm.startGame = startGame;
        vm.roll = roll;
        vm.resetRollNumber = resetRollNumber;
        vm.setIsInputRequired = setIsInputRequired;
        vm.setIsAnnouncementRequired = setIsAnnouncementRequired;
        vm.saveGame = saveGame;

        function activate() {
            vm.diceOptions = helperService.getDiceOptions();
            setSelectedDiceOption(vm.diceOptions[0]);

            vm.rollNumber = 0;
            vm.hasGameStarted = false;
            vm.isInputRequired = false;
            vm.isAnnouncementRequired = false;
        }

        function setSelectedDiceOption(diceOption) {
            vm.selectedDiceOption = diceOption;
        }

        function startGame() {
            vm.hasGameStarted = true;
            vm.diceIndices = getDiceIndices(vm.selectedDiceOption.value);

            apiService.custom('games', null, 'post', 'game-started', {
                user_id: userId,
                number_of_dice: vm.selectedDiceOption.value.toString()
            });

            $scope.$broadcast('start');
            roll();
        }
        
        function roll() {
            incrementRollNumber();
            $scope.$broadcast('roll');

            if (vm.rollNumber === 3) {
                setIsInputRequired(true);
            }
        }

        function getDiceIndices(numberOfDice) {
            var diceIndices = [];

            for (var i = 0; i < numberOfDice; i++) {
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
            vm.finalResult = finalResult;

            $scope.$broadcast('stop');

            var data = {
                game: {
                    user_id: userId,
                    number_of_dice: vm.selectedDiceOption.value.toString(),
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
