#!/usr/bin/env node

import http from 'http';
import app from '../app';
import logger from '../logger';
import { connectSockets } from './../shared/sockets/index';
import configuration from './../configuration';

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: string) => {
  const value = parseInt(val, 10);

  if (isNaN(value)) {
    // named pipe
    return val;
  }

  if (value >= 0) {
    // port number
    return value;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
};

const port = normalizePort(process.env.PORT || '8089');
app.set('port', port);

const server = http.createServer(app);

connectSockets(server);

configuration.connect().then(() => {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});
