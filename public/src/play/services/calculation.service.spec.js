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

    it('should calculate min value correctly', function() {
        var result;
        var testCases = getTestCasesForMin();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getMinValue(testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    it('should calculate max value correctly', function() {
        var result;
        var testCases = getTestCasesForMax();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getMaxValue(testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    it('should calculate ones value correctly', function() {
        var result;
        var testCases = getTestCasesForOnes();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getOneToSixValue(testCase.cell, testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    it('should calculate twos value correctly', function() {
        var result;
        var testCases = getTestCasesForTwos();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getOneToSixValue(testCase.cell, testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    it('should calculate threes value correctly', function() {
        var result;
        var testCases = getTestCasesForThrees();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getOneToSixValue(testCase.cell, testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    it('should calculate fours value correctly', function() {
        var result;
        var testCases = getTestCasesForFours();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getOneToSixValue(testCase.cell, testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    it('should calculate fives value correctly', function() {
        var result;
        var testCases = getTestCasesForFives();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getOneToSixValue(testCase.cell, testCase.diceValues);
            expect(result).toBe(testCase.expectedResult);
        }
    });

    it('should calculate sixes value correctly', function() {
        var result;
        var testCases = getTestCasesForSixes();

        testCases.forEach(testTestCase);

        function testTestCase(testCase) {
            result = service.getOneToSixValue(testCase.cell, testCase.diceValues);
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

    function getTestCasesForMin() {
        return [
            {
                diceValues: [1, 1, 1, 1, 1, 2],
                expectedResult: 5
            },
            {
                diceValues: [2, 2, 3, 3, 1, 6],
                expectedResult: 11
            },
            {
                diceValues: [5, 3, 1, 1, 1, 2],
                expectedResult: 8
            },
            {
                diceValues: [3, 2, 2, 1, 3],
                expectedResult: 11
            }
        ];
    }

    function getTestCasesForMax() {
        return [
            {
                diceValues: [4, 5, 5, 6, 2, 4],
                expectedResult: 24
            },
            {
                diceValues: [6, 6, 5, 5, 4, 4],
                expectedResult: 26
            },
            {
                diceValues: [6, 3, 5, 5, 5],
                expectedResult: 24
            },
            {
                diceValues: [3, 3, 1, 6, 5, 4],
                expectedResult: 21
            }
        ];
    }

    function getTestCasesForOnes() {
        var testCases = [
            {
                diceValues: [3, 4, 6, 2, 2],
                expectedResult: 0
            },
            {
                diceValues: [1, 2, 3, 1, 1, 6],
                expectedResult: 3
            },
            {
                diceValues: [1, 1, 1, 1, 1, 1],
                expectedResult: 5
            },
            {
                diceValues: [2, 3, 1, 1, 5, 6],
                expectedResult: 2
            },
            {
                diceValues: [6, 6, 6, 6, 1],
                expectedResult: 1
            }
        ];

        testCases.forEach(getAssignCellProperty('1'));
        
        return testCases;
    }

    function getTestCasesForTwos() {
        var testCases = [
            {
                diceValues: [5, 5, 3, 2, 1],
                expectedResult: 2
            },
            {
                diceValues: [6, 5, 3, 5, 5, 4],
                expectedResult: 0
            },
            {
                diceValues: [2, 2, 2, 2, 2, 2],
                expectedResult: 10
            },
            {
                diceValues: [3, 2, 2, 4, 2, 5],
                expectedResult: 6
            },
            {
                diceValues: [5, 4, 3, 3, 1, 2],
                expectedResult: 2
            }
        ];

        testCases.forEach(getAssignCellProperty('2'));
        
        return testCases;
    }

    function getTestCasesForThrees() {
        var testCases = [
            {
                diceValues: [1, 1, 3, 2, 5, 3],
                expectedResult: 6
            },
            {
                diceValues: [4, 4, 2, 1, 2, 3],
                expectedResult: 3
            },
            {
                diceValues: [6, 6, 5, 4, 5],
                expectedResult: 0
            },
            {
                diceValues: [3, 3, 3, 3, 3, 3],
                expectedResult: 15
            },
            {
                diceValues: [2, 2, 1, 5, 4, 3],
                expectedResult: 3
            }
        ];

        testCases.forEach(getAssignCellProperty('3'));
        
        return testCases;
    }

    function getTestCasesForFours() {
        var testCases = [
            {
                diceValues: [4, 4, 4, 4, 3, 1],
                expectedResult: 16
            },
            {
                diceValues: [2, 2, 1, 6, 5],
                expectedResult: 0
            },
            {
                diceValues: [4, 4, 4, 4, 4, 4],
                expectedResult: 20
            },
            {
                diceValues: [2, 1, 1, 2, 4],
                expectedResult: 4
            },
            {
                diceValues: [1, 2, 4, 3, 3, 4],
                expectedResult: 8
            }
        ];

        testCases.forEach(getAssignCellProperty('4'));
        
        return testCases;
    }

    function getTestCasesForFives() {
        var testCases = [
            {
                diceValues: [5, 5, 1, 2, 5, 5],
                expectedResult: 20
            },
            {
                diceValues: [1, 2, 3, 2, 2],
                expectedResult: 0
            },
            {
                diceValues: [5, 5, 5, 5, 5, 5],
                expectedResult: 25
            },
            {
                diceValues: [3, 2, 1, 1, 5],
                expectedResult: 5
            },
            {
                diceValues: [5, 3, 5, 3, 5, 1],
                expectedResult: 15
            }
        ];

        testCases.forEach(getAssignCellProperty('5'));
        
        return testCases;
    }

    function getTestCasesForSixes() {
        var testCases = [
            {
                diceValues: [2, 6, 6, 2, 3],
                expectedResult: 12
            },
            {
                diceValues: [5, 5, 5, 5, 3, 2],
                expectedResult: 0
            },
            {
                diceValues: [6, 6, 6, 6, 6, 6],
                expectedResult: 30
            },
            {
                diceValues: [1, 2, 6, 2, 2],
                expectedResult: 6
            },
            {
                diceValues: [5, 4, 4, 5, 2, 6],
                expectedResult: 6
            }
        ];

        testCases.forEach(getAssignCellProperty('6'));
        
        return testCases;
    }

    function getAssignCellProperty(rowAbbreviation) {
        return function(item) {
            item.cell = {
                row: {
                    abbreviation: rowAbbreviation
                }
            }
        };
    }
});