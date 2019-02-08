import { createLogger, format, transports } from 'winston';

const options = {
  console: {
    format: format.combine(format.timestamp(), format.colorize(), format.simple()),
    handleExceptions: true,
    level: 'debug'
  }
};

const logger = createLogger({
  exitOnError: false,
  transports: [new transports.Console(options.console)]
});

export default logger;
