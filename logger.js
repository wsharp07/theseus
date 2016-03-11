var winston = require('winston');
var fs = require('fs');

var logDir = 'logs';
var logFile = 'theseus.log';

if ( !fs.existsSync( logDir ) ) {
	// Create the directory if it does not exist
	fs.mkdirSync( logDir );
}

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level:              'debug',
            filename:           './' + logDir + '/' + logFile,
            handleExceptions:   true,
            json:               true,
            maxSize:            5242880,
            maxFiles:           5,
            colorize:           false
        }),
        new winston.transports.Console({
            level:              'debug',
            handleExceptions:   true,
            json:               false,
            colorize:           true
        })
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};

module.exports = logger;