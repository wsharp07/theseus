var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var config = require('./config');

// Routes
var routes = require('./src/routes/index');
var rmas = require('./src/routes/rmas');

app.set('view engine', 'jade');
app.set('views', './src/views');
app.use(express.static('dist'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/stylesheets', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/stylesheets', express.static(__dirname + '/node_modules/backgrid/lib/'));
app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/js/'));
app.use('/scripts', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/scripts', express.static(__dirname + '/node_modules/backgrid/lib/'));
app.use('/scripts', express.static(__dirname + '/node_modules/backbone/'));
app.use('/scripts', express.static(__dirname + '/node_modules/underscore/'));
app.use('/scripts', express.static(__dirname + '/node_modules/knockout/build/output/'));

// Routes
app.use('/', routes);
app.use('/rmas', rmas);

config.init();

// Start App
app.listen(config.web.port, function () {
    console.log('[Theseus] Listening on port ' + config.web.port);
    console.log(config.database.getConnectionString());
    mongoose.connect(config.database.getConnectionString());
    
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("[Theseus] Connected to MongoDB")
    });
});
