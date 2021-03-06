jest.autoMockOff();

describe("RmaHelper", function(){
    
    it("should get the next rma number in sequence for current year", function(){
        const RmaHelper = require('../helpers/RmaHelper');
        var currentYear = new Date().getFullYear()
        var currentRmaNumber = "RMA-" + currentYear + "-001"
        var nextRmaNumber = RmaHelper.getNextRmaNumber(currentRmaNumber);
       
        expect(nextRmaNumber).toEqual("RMA-" + currentYear + "-002");
    });
    
    it("should have correct padding with a two digit suffix", function(){
        const RmaHelper = require('../helpers/RmaHelper');
        var currentYear = new Date().getFullYear()
        var currentRmaNumber = "RMA-" + currentYear + "-009"
        var nextRmaNumber = RmaHelper.getNextRmaNumber(currentRmaNumber);
       
        expect(nextRmaNumber).toEqual("RMA-" + currentYear + "-010");
    });
    
    it("should get the next rma number in sequence across years", function(){
        const RmaHelper = require('../helpers/RmaHelper');
        var currentYear = new Date().getFullYear().toString();
        var prevYear = (new Date().getFullYear() - 1).toString();
        var currentRmaNumber = "RMA-" + prevYear + "-005";
        var nextRmaNumber = RmaHelper.getNextRmaNumber(currentRmaNumber);
       
        expect(nextRmaNumber).toEqual("RMA-" + currentYear + "-001");
    });
    
    it("should generate an rma number if one does not already exist", function(){
        const RmaHelper = require('../helpers/RmaHelper');
        var nextRmaNumber = RmaHelper.getNextRmaNumber();
        var currentYear = new Date().getFullYear().toString();
       
        expect(nextRmaNumber).toEqual("RMA-" + currentYear + "-001");
    });
});