function PaginationParser(query){
    var query = query;
    this.page = 0;
    this.pageSize = 0;
    this.sort = 'desc';
    this.sortBy = null;
    this.recordsToSkip = 0;

    function getRecordsToSkip(page, pageSize) {
        return (page - 1) * pageSize;
    }
    
    function parse(self, query){
        if(!query) return;
        
        if (query.page) {
            self.page = parseInt(query.page);
        }
        
        if (query.per_page) {
            self.pageSize = parseInt(query.per_page);
        }
        
        if (query.order) {
            self.sort = query.order;
        }
        
        if (query.sort_by) {
            self.sortBy = query.sort_by;
        }
        
        if(self.page && self.pageSize) {
            self.recordsToSkip = getRecordsToSkip(self.page, self.pageSize);
        }
    }
    
    parse(this, query);
};

PaginationParser.prototype.getSortString = function(){
    if(this.sort === 'desc') {
        return '-' + this.sortBy;
    }
    
    return this.sortBy;
}

module.exports = PaginationParser;