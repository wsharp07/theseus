var RmaHelper = require('../helpers/RmaHelper');

describe("RmaHelper", function(){
    
    it("should get the next rma number in sequence for current year", function(){
        var currentRmaNumber = "RMA-2016-001"
        var nextRmaNumber = RmaHelper.getNextRmaNumber(currentRmaNumber);
       
        expect(nextRmaNumber).toEqual("RMA-2016-002");
    });
    
    it("should have correct padding with a two digit suffix", function(){
        var currentRmaNumber = "RMA-2016-009"
        var nextRmaNumber = RmaHelper.getNextRmaNumber(currentRmaNumber);
       
        expect(nextRmaNumber).toEqual("RMA-2016-010");
    });
    
    it("should get the next rma number in sequence across years", function(){
        var currentYear = new Date().getFullYear().toString();
        var prevYear = (new Date().getFullYear() - 1).toString();
        var currentRmaNumber = "RMA-" + prevYear + "-005";
        var nextRmaNumber = RmaHelper.getNextRmaNumber(currentRmaNumber);
       
        expect(nextRmaNumber).toEqual("RMA-" + currentYear + "-001");
    });
});