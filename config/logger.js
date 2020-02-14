import * as winston from 'winston';
import * as winston_rotate from 'winston-daily-rotate-file';
import config from "./phaseOneConfig";

const logs = config.logs;

var options = {
    file: {
        level: 'info',
        filename: logs.file_name,
        dirname: logs.path,
        handleExceptions: true,
        json: true,
        maxsize: 1024 * 1024 * 20, // 20MB
        maxFiles: 30,
        colorize: false,
        datePattern: '.YYYY-MM-DD'
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
    transports: [
        new winston.transports.DailyRotateFile(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
    error: function (message) {
        logger.error(message);
    }
};
export default logger;