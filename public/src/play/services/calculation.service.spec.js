describe('calculationService', function() {
    var service;

    module.sharedInjector();

    beforeAll(module('yamb-v2'));

    beforeAll(inject(function(calculationService) {
        service = calculationService;
    }));

    it('should return correct value for straight', function() {
        var rollNumber = 1;
        var diceValues = [1, 2, 3, 4, 5];
        var result;
        
        result = service.getStraightValue(rollNumber, diceValues);
        expect(result).toBe(66);
    });
});