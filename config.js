var config = {};
var node_env = process.env.NODE_ENV || 'development';
var dns = require('dns');

config.web = {};
config.database = {};

config.init = function() {
    
    this.setDefaults();
    
    if(node_env === 'development') {
        this.setDev();
    }
    else if (node_env === 'production') {
        this.setProd();
    }
}
config.setDefaults = function() {
    config.web.port = 3000;
    config.database.hostname = 'localhost';
    config.database.port = 27017;
    config.database.name = 'theseusdb';
}

config.setDev = function() {
    config.database.hostname = '192.168.99.100';
    config.database.port = 32768;
}

config.setProd = function() {
    //'mongo.default.svc.cluster.local';
    config.database.hostname = process.env.MONGO_SERVICE_HOST;
}

config.database.getConnectionString = function(){
    return 'mongodb://' 
        + this.hostname 
        + ':' + this.port 
        + '/' + this.name;
}

module.exports = config;