describe('calculationService', function() {
    var service;

    module.sharedInjector();

    beforeAll(module('yamb-v2'));

    beforeAll(inject(function(calculationService) {
        service = calculationService;
    }));

    it('should calculate straight value correctly', function() {
        var result;
        var testCases = getTestCasesForStraight();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getStraightValue(testCase.rollNumber, testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    it('should calculate full house value correctly', function() {
        var result;
        var testCases = getTestCasesForFullHouse();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getFullHouseValue(testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    it('should calculate quads value correctly', function() {
        var result;
        var testCases = getTestCasesForQuads();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getQuadsValue(testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    it('should calculate yamb value correctly', function() {
        var result;
        var testCases = getTestCasesForYamb();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getYambValue(testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    function getTestCasesForStraight() {
        return [
            {
                rollNumber: 1,
                diceValues: [5, 2, 3, 4, 1, 2],
                expectedResult: 66
            },
            {
                rollNumber: 2,
                diceValues: [1, 2, 3, 4, 1, 2],
                expectedResult: 0
            },
            {
                rollNumber: 2,
                diceValues: [5, 4, 2, 3, 1],
                expectedResult: 56
            },
            {
                rollNumber: 2,
                diceValues: [6, 6, 5, 3, 4, 2],
                expectedResult: 56
            },
            {
                rollNumber: 3,
                diceValues: [1, 1, 2, 3, 4, 4],
                expectedResult: 0
            },
            {
                rollNumber: 3,
                diceValues: [3, 4, 5, 6, 2],
                expectedResult: 46
            }
        ];
    }

    function getTestCasesForFullHouse() {
        return [
            {
                diceValues: [1, 3, 4, 5, 1, 3],
                expectedResult: 0
            },
            {
                diceValues: [2, 5, 4, 5, 2, 5],
                expectedResult: 49
            },
            {
                diceValues: [1, 6, 6, 6, 1],
                expectedResult: 50
            },
            {
                diceValues: [2, 6, 6, 5, 3, 4],
                expectedResult: 0
            },
            {
                diceValues: [2, 3, 3, 4, 4, 3],
                expectedResult: 47
            },
            {
                diceValues: [3, 5, 3, 5, 3],
                expectedResult: 49
            },
            {
                diceValues: [2, 2, 2, 2, 2, 2],
                expectedResult: 0
            },
            {
                diceValues: [1, 1, 1, 1, 1],
                expectedResult: 0
            },
            {
                diceValues: [6, 6, 6, 4, 4],
                expectedResult: 56
            }
        ];
    }

    function getTestCasesForQuads() {
        return [
            {
                diceValues: [2, 4, 1, 4, 5, 4],
                expectedResult: 0
            },
            {
                diceValues: [5, 2, 1, 5, 3],
                expectedResult: 0
            },
            {
                diceValues: [2, 5, 4, 5, 5, 5],
                expectedResult: 60
            },
            {
                diceValues: [6, 6, 6, 6, 1, 6],
                expectedResult: 64
            },
            {
                diceValues: [2, 2, 1, 2, 2],
                expectedResult: 48
            },
            {
                diceValues: [4, 4, 4, 4, 4],
                expectedResult: 56
            },
            {
                diceValues: [1, 1, 1, 1, 1, 1],
                expectedResult: 44
            }
        ];
    }

    function getTestCasesForYamb() {
        return [
            {
                diceValues: [1, 1, 1, 1, 1],
                expectedResult: 55
            },
            {
                diceValues: [2, 3, 5, 1, 2, 6],
                expectedResult: 0
            },
            {
                diceValues: [6, 6, 6, 3, 1],
                expectedResult: 0
            },
            {
                diceValues: [6, 6, 6, 6, 6, 6],
                expectedResult: 80
            },
            {
                diceValues: [5, 4, 4, 4, 4, 4],
                expectedResult: 70
            },
            {
                diceValues: [2, 2, 2, 2, 2],
                expectedResult: 60
            }
        ];
    }
});