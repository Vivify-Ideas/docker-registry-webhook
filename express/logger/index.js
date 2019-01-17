const {
    createLogger,
    transports,
    format
} = require('winston');
const appRootPath = require('app-root-path');

const options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        format: format.combine(format.timestamp(), format.colorize(), format.simple())
    },
};

const logger = createLogger({
    transports: [
        new transports.Console(options.console)
    ],
    exitOnError: false,
});

logger.stream = {
    write: (message, encoding) => logger.info(message)
};

module.exports = logger;