var Rma = require('../models/rmaModel');
var textHelper = require('./TextHelper');

var RmaHelper = (function(){
    
    var RmaNumber = (function(){
        var SEPARATOR = '-';
        var PREFIX = "RMA";
        
        function RmaNumber(){
            this.prefix = PREFIX;
            this.year = null;
            this.suffix = null;     
        }
       
        RmaNumber.prototype.create = function(){
            var arr = [];
            arr.push(this.prefix);
            arr.push(this.year);
            arr.push(this.suffix);
            return arr.join(SEPARATOR);
        }
        
        RmaNumber.prototype.parse = function(rmaNumber) {
            var arr = rmaNumber.split(SEPARATOR);
            var res = new RmaNumber();
            res.prefix = arr[0];
            res.year = arr[1];
            res.suffix = arr[2];
            return res;
        }
        
        return RmaNumber;
    }());
    
    function getNextRmaNumber(lastRmaNumber){
        var prevRma = new RmaNumber().parse(lastRmaNumber);
        var newRma = new RmaNumber();
        var currentYear = new Date().getFullYear().toString();
        var newSuffix = getRmaSuffix(parseInt(prevRma.suffix), prevRma.year);
             
        newRma.year = currentYear;
        newRma.suffix = newSuffix;
        
        return newRma.create();
    }
    
    function getRmaSuffix(prevSuffix, prevYear){
         var currentYear = new Date().getFullYear().toString();
         if(currentYear !== prevYear){
             return "001";
         }
         
         var newSuffix = prevSuffix + 1;
         return textHelper.pad(newSuffix,3);
    }
    
    return {
        getNextRmaNumber: getNextRmaNumber
    }
}());


module.exports = RmaHelper;