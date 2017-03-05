var indexPage = (function() {

    var RmaModel = function() {
        var self = this;
        self.rmaNumber = ko.observable();
        self.product = ko.observable();
        self.serialNumber = ko.observable();
        self.comments = ko.observable();
        self.status = ko.observable("Open");

        self.rmaStatusOptions = ['Open', 'Closed'];
        
        self.grid = $("#rmaGrid").data("kendoGrid");
    };

    RmaModel.prototype.getJson = function() {
        return JSON.stringify({
            rmaNumber: this.rmaNumber(),
            product: this.product(),
            serialNumber: this.serialNumber(),
            comments: this.comments(),
            status: this.status()
        });
    }

    var _rmaModel = new RmaModel();
    // Document Ready
    $(document).ready(function() {
        ko.applyBindings(_rmaModel);

        $('#btnClear').on('click', function(e) {
            e.preventDefault();

            $("#rmaForm").clearForm();
        });


        $("#rmaGrid2").kendoGrid({
            dataSource: {
                transport: {
                    read: "/rmas"
                },
                schema: {
                    data: "data",
                    total: "total",
                    model: {
                        fields: {
                            rmaNumber: { type: "string" },
                            product: { type: "string" },
                            serialNumber: { type: "string" },
                            comments: { type: "string" }
                        }
                    }
                },
                sort: {
                    field: "rmaNumber",
                    dir: "desc"
                },
                pageSize: 5,
                serverPaging: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            pageable: true,
            columns: [{
                    field:"_id",
                    filterable: false,
                    hidden: true
                },
                {
                    field: "rmaNumber",
                    title: "RMA #"
                }, {
                    field: "product",
                    title: "Product"
                }, {
                    field: "serialNumber",
                    title: "Serial #"
                }, {
                    field: "comments",
                    title: "Comments"
                }, {
                    field: "status",
                    title: "Status"
                }
            ]
        });

    });

    var dataSource = getDataSource();
    var columns = getColumns();
    var grid = buildGrid(columns, dataSource);
    var paginator = buildPaginator(dataSource);

    renderGrid(grid, paginator);
    //dataSource.fetch({ reset: true });

    $("#rmaForm").submit(function(e) {
        e.preventDefault();

        $.ajax({
            method: "POST",
            url: "/rmas",
            contentType: 'application/json; charset=UTF-8',
            data: _rmaModel.getJson()
        })
            .done(function(data) {
                $("#rmaForm").clearForm();
                _rmaModel.grid.read();
            })
            .error(function(jqXHR, textStatus, err) {
                console.log(err);
            });
    });

    function getDataSource() {
        var RmasDataSource = Backbone.PageableCollection.extend({
            url: "/rmas",
            // Initial pagination states
            state: {
                pageSize: 10,
                sortKey: "rmaNumber",
                order: -1
            },
            parseState: function(res, queryParams, state, options) {
                return { totalRecords: res.total_count };
            },
            parseRecords: function(res, options) {
                return res.data;
            }
        });

        return new RmasDataSource();
    }

    function getColumns() {
        return [
            {
                name: "rmaNumber",
                label: "RMA #",
                cell: "string",
                editable: false
            },
            {
                name: "product",
                label: "Product",
                cell: "string",
                editable: false
            },
            {
                name: "serialNumber",
                label: "Serial #",
                cell: "string",
                editable: false
            },
            {
                name: "comments",
                label: "Comments",
                cell: "string",
                editable: false
            },
            {
                name: "status",
                label: "Status",
                cell: "string",
                editable: false
            },
            {
                name: "createdAt",
                label: "Created At",
                cell: "date",
                editable: false
            }
        ];
    }

    function buildGrid(columns, dataSource) {
        return new Backgrid.Grid({
            columns: columns,
            collection: dataSource
        });
    }

    function buildPaginator(dataSource) {
        return new Backgrid.Extension.Paginator({
            windowSize: 10, // Default is 10
            slideScale: 0.25, // Default is 0.5
            goBackFirstOnSort: true, // Default is true
            collection: dataSource
        });
    }
    
    function renderGrid(grid, paginator) {
        var $rmaGrid = $("#rmaGrid");
        $rmaGrid.append(grid.render().el)
        $rmaGrid.append(paginator.render().el);
    }

    return {
        dataSource: dataSource
    }
} ());
