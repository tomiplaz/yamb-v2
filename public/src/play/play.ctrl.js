(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .controller('PlayCtrl', PlayCtrl);

    PlayCtrl.$inject = ['$scope', 'apiService', 'userService', 'toastr', 'helperService', 'modalService', '$state'];
    function PlayCtrl($scope, apiService, userService, toastr, helperService, modalService, $state) {
        var vm = this;

        var userId = userService.getUserId();

        activate();

        vm.setSelectedDiceOption = setSelectedDiceOption;
        vm.startGame = startGame;
        vm.roll = roll;
        vm.undo = undo;
        vm.setRollNumber = setRollNumber;
        vm.setIsInputRequired = setIsInputRequired;
        vm.setIsAnnouncementRequired = setIsAnnouncementRequired;
        vm.setIsUndoAvailable = setIsUndoAvailable;
        vm.saveGame = saveGame;

        function activate() {
            vm.diceOptions = helperService.getDiceOptions();
            setSelectedDiceOption(vm.diceOptions[0]);

            vm.rollNumber = 0;
            vm.hasGameStarted = false;
            vm.isInputRequired = false;
            vm.isAnnouncementRequired = false;
            vm.isUndoAvailable = false;
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
            setIsUndoAvailable(false);

            $scope.$broadcast('roll');

            if (vm.rollNumber === 3) {
                setIsInputRequired(true);
            }
        }

        function undo() {
            $scope.$broadcast('undo');
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

        function setRollNumber(value) {
            vm.rollNumber = value;
        }

        function setIsInputRequired(value) {
            vm.isInputRequired = value;
        }

        function setIsAnnouncementRequired(value) {
            vm.isAnnouncementRequired = value;
        }

        function setIsUndoAvailable(value) {
            vm.isUndoAvailable = value;
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
                .then(successCallback, errorCallback)
                .finally(finallyCallback);

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

                var modal = modalService.getModalInstance(
                    modalService.MODALS.GAME_INFO,
                    {
                        user: userService.getUser(),
                        game: response,
                        diceKey: vm.selectedDiceOption.key
                    }
                );
            }

            function errorCallback(response) {
                toastr.error("Final result was " + finalResult + ".", "Game not saved");
            }

            function finallyCallback() {
                $state.reload();
            }
        }
    }
})();
