var indexPage = (function(){

  var RmaModel = function(){
    var self = this;
    self.rmaNumber = ko.observable();
    self.product = ko.observable();
    self.serialNumber = ko.observable();
  };

  var _rmaModel = new RmaModel();
  $(document).ready(function(){
    ko.applyBindings(_rmaModel);
  });
    
  var columns =  [
          {
              name: "rmaNumber",
              label: "RMA #",
              cell: "string",
              editable: false
          },
          {
              name: "product",
              label: "Product",
              cell: "string"
          },
          {
              name: "serialNumber",
              label: "Serial #",
              cell: "string"
          },
          {
              name: "createdAt",
              label: "Created At",
              cell: "date",
              editable: false
          }
   ];
   
   var dataSource = new Backbone.Collection;
   dataSource.url = "/rmas";
   
   var grid = new Backgrid.Grid({
       columns: columns,
       collection: dataSource
   });
   
   var $rmaGrid = $("#rmaGrid");
   $rmaGrid.append(grid.render().el)
   
   dataSource.fetch({reset: true});
   
     $("#rmaForm").submit(function(e){
        e.preventDefault();
        
        $.ajax({
            method: "POST",
            url: "/rmas",
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({
                rmaNumber: _rmaModel.rmaNumber(),
                product: _rmaModel.product(),
                serialNumber: _rmaModel.serialNumber()
            })
        })
        .done(function(data){
            console.log(data.rmaNumber + " added successfully");
            dataSource.add(data);
        })
        .error(function(jqXHR,textStatus,err){
            console.log(err);
        });
   });
   
   
   return {
       dataSource: dataSource
   }
}());
