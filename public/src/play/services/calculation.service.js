(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .factory('calculationService', calculationService);
    
    function calculationService() {
        return {
            getStraightValue: getStraightValue,
            getFullHouseValue: getFullHouseValue,
            getQuadsValue: getQuadsValue,
            getYambValue: getYambValue,
            getMinMaxValue: getMinMaxValue,
            getOneToSixValue: getOneToSixValue,
            getCalculateSum: getCalculateSum,
            getFinalResult: getFinalResult
        }

        function getStraightValue(rollNumber, diceValues) {
            return isStraight() ? 66 - (rollNumber - 1) * 10 : 0;

            function isStraight() {
                var sortedString = diceValues.sort().join('');
                return (sortedString.indexOf('12345') !== -1 || sortedString.indexOf('23456') !== -1);
            }
        }

        function getFullHouseValue(diceValues) {
            var fullHouse = getFullHouse();

            return fullHouse.every(hasValue) ? fullHouse[0] * 3 + fullHouse[1] * 2 + 30 : 0;

            function getFullHouse() {
                var diceCount = getDiceCount();

                return [getFullHouseMember(2), getFullHouseMember(1)];

                function getDiceCount() {
                    var diceCount = {};

                    [1, 2, 3, 4, 5, 6].forEach(initDiceCount);
                    diceValues.forEach(incrementCount);

                    return diceCount;

                    function initDiceCount(value) {
                        diceCount[value] = 0;
                    }

                    function incrementCount(dieValue) {
                        diceCount[dieValue]++;
                    }
                }
                
                function getFullHouseMember(count) {
                    for (var i = 6; i > 0; i--) {
                        if (diceCount[i] > count) {
                            delete diceCount[i];
                            return i;
                        }
                    }
                }
            }
        }

        function getQuadsValue(diceValues) {
            var sorted = diceValues.sort();

            return isQuads() ? 40 + sorted[2] * 4 : 0;

            function isQuads() {
                for (var i = sorted.length - 1; i >= 3; i--) {
                    if (sorted[i] === sorted[i - 3]) return true;
                }
                return false;
            }
        }

        function getYambValue(diceValues) {
            var sorted = diceValues.sort();

            return isYamb() ? 50 + sorted[1] * 5 : 0;

            function isYamb() {
                for (var i = sorted.length - 1; i >= 4; i--) {
                    if (sorted[i] === sorted[i - 4]) return true;
                }
                return false;
            }
        }

        function getMinMaxValue(diceValues) {
            return diceValues.reduce(sumReduction, 0);
        }

        function getOneToSixValue(cell, diceValues) {
            var count = 0;
            var rowWeight = parseInt(cell.row.abbreviation);

            diceValues.forEach(incrementCountIfValid);

            return (count > 5 ? 5 : count) * rowWeight;

            function incrementCountIfValid(dieValue) {
                if (dieValue === rowWeight) count++;
            }
        }

        function getCalculateSum(rows, cells) {
            return function(cellKey, row, column) {
                switch (row.abbreviation) {
                    case 'usum':
                        var relevantValues = getRelevantValues(6);
                        if (relevantValues.every(hasValue)) {
                            var sum = relevantValues.reduce(sumReduction, 0);
                            cells[cellKey].value = (sum >= 60 ? sum + 30 : sum);
                        }
                        break;
                    case 'msum':
                        var relevantValues = getRelevantValues(2);
                        var onesCellKey = rows[0].abbreviation + '_' + column.abbreviation;
                        if (relevantValues.every(hasValue) && cells[onesCellKey].value !== null) {
                            var difference = relevantValues[1] - relevantValues[0];
                            cells[cellKey].value = (difference < 0 ? 0 : difference * cells[onesCellKey].value);
                        }
                        break;
                    case 'lsum':
                        var relevantValues = getRelevantValues(4);
                        if (relevantValues.every(hasValue)) {
                            cells[cellKey].value = relevantValues.reduce(sumReduction, 0);
                        }
                        break;
                    default:
                }

                function getRelevantValues(numberOfTrailingCells) {
                    var cellKey = null;
                    var relevantValues = [];

                    for (var i = 1; i <= numberOfTrailingCells; i++) {
                        cellKey = rows[row.id - 1 - i].abbreviation + '_' + column.abbreviation;
                        relevantValues.push(cells[cellKey].value);
                    }

                    return relevantValues;
                }
            };
        }

        function calculateSum(cellKey, row, column) {
            switch (row.abbreviation) {
                case 'usum':
                    var relevantValues = getRelevantValues(6);
                    if (relevantValues.every(hasValue)) {
                        var sum = relevantValues.reduce(sumReduction, 0);
                        scope.cells[cellKey].value = (sum >= 60 ? sum + 30 : sum);
                    }
                    break;
                case 'msum':
                    var relevantValues = getRelevantValues(2);
                    var onesCellKey = rows[0].abbreviation + '_' + column.abbreviation;
                    if (relevantValues.every(hasValue) && scope.cells[onesCellKey].value !== null) {
                        var difference = relevantValues[1] - relevantValues[0];
                        scope.cells[cellKey].value = (difference < 0 ? 0 : difference * scope.cells[onesCellKey].value);
                    }
                    break;
                case 'lsum':
                    var relevantValues = getRelevantValues(4);
                    if (relevantValues.every(hasValue)) {
                        scope.cells[cellKey].value = relevantValues.reduce(sumReduction, 0);
                    }
                    break;
                default:
            }

            function getRelevantValues(numberOfTrailingCells) {
                var cellKey = null;
                var relevantValues = [];

                for (var i = 1; i <= numberOfTrailingCells; i++) {
                    cellKey = rows[row.id - 1 - i].abbreviation + '_' + column.abbreviation;
                    relevantValues.push(scope.cells[cellKey].value);
                }

                return relevantValues;
            }
        }

        function getFinalResult(sumsValues) {
            return sumsValues.reduce(sumReduction, 0);
        }

        function hasValue(value) {
            return value !== null && value !== undefined;
        }

        function sumReduction(accumulator, value) {
            return accumulator + value;
        }
    }
})();
