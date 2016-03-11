var PaginationParser = require('../helpers/PaginationParser');

var query = {
    page: '1',
    per_page: '10',
    order: 'desc',
    sort_by: 'myVar'
}

describe('PaginationParser', function(){
    it ('should parse page query as int', function(){
        var parser = new PaginationParser(query);
        
        expect(parser.page).toEqual(1);
        expect(typeof(parser.page)).toEqual('number');
    });
    
    it ('should parse pageSize query as int', function(){
        var parser = new PaginationParser(query);
        
        expect(parser.pageSize).toEqual(10);
        expect(typeof(parser.pageSize)).toEqual('number');
    });
    
    it ('should provide a negative sort arg for desc', function (){
        var parser = new PaginationParser(query);
        
        var sut = parser.getSortString();
        expect(sut).toEqual('-myVar');
    });
    
    it ('should provide a sort arg for asc', function (){
        query.order = 'asc';
        var parser = new PaginationParser(query);
        
        var sut = parser.getSortString();
        expect(sut).toEqual('myVar');
    });
    
    it ('should not skip records on page 1',function() {
       var parser = new PaginationParser(query);
       
       expect(parser.recordsToSkip).toEqual(0);
    });
    
    it ('should skip 10 records on page 2', function(){
       query.page = 2;
       var parser = new PaginationParser(query);
       
       expect(parser.recordsToSkip).toEqual(10);
    });
    
    it ('should skip 20 records on page 3', function(){
       query.page = 3;
       var parser = new PaginationParser(query);
       
       expect(parser.recordsToSkip).toEqual(20);
    });
});