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
            getMinValue: getMinValue,
            getMaxValue: getMaxValue,
            getOneToSixValue: getOneToSixValue,
            getCalculateSum: getCalculateSum,
            getFinalResult: getFinalResult
        }

        function getStraightValue(rollNumber, diceValues) {
            return isStraight() ? 66 - (rollNumber - 1) * 10 : 0;

            function isStraight() {                
                return [1, 2, 3, 4, 5].every(isAmongDiceValues) || [2, 3, 4, 5, 6].every(isAmongDiceValues);
                
                function isAmongDiceValues(number) {
                    return diceValues.indexOf(number) !== -1;
                }
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

        function getMinValue(diceValues) {
            var sorted = diceValues.sort();
            sorted.length = 5;

            return sorted.reduce(sumReduction, 0);
        }

        function getMaxValue(diceValues) {
            var sorted = diceValues.sort().reverse();
            sorted.length = 5;

            return sorted.reduce(sumReduction, 0);
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
                        } else {
                            cells[cellKey].value = null;
                        }
                        break;
                    case 'msum':
                        var relevantValues = getRelevantValues(2);
                        var onesCellKey = rows[0].abbreviation + '_' + column.abbreviation;
                        if (relevantValues.every(hasValue) && cells[onesCellKey].value !== null) {
                            var difference = relevantValues[1] - relevantValues[0];
                            cells[cellKey].value = (difference < 0 ? 0 : difference * cells[onesCellKey].value);
                        } else {
                            cells[cellKey].value = null;
                        }
                        break;
                    case 'lsum':
                        var relevantValues = getRelevantValues(4);
                        if (relevantValues.every(hasValue)) {
                            cells[cellKey].value = relevantValues.reduce(sumReduction, 0);
                        } else {
                            cells[cellKey].value = null;
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
