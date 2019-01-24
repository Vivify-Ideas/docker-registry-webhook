import { Logger } from './typings/logger';
import { SocketsServer } from './../sockets/index';
import utils from './../utils';

const SEND_SOCKETS_IN_INTERVAL = 5000;

export class SocketConsoleLogger implements Logger {
  channel: string = '';
  sockets: { type: string, text: string }[] = [];
  interval: any = null;

  constructor(projectName: string, namespace: string) {
    this.channel = `/logs/${projectName}/${namespace}`;
    this.interval = setInterval(() => {
      SocketsServer.emit(this.channel, this.sockets);
      this.sockets = [];
    }, SEND_SOCKETS_IN_INTERVAL)
  }

  clear() {
    clearInterval(this.interval);
  }

  logError(msg: string): void {
    this.sockets.push({
      type: 'error',
      text: msg
    });
    utils.logError(msg);
  }

  logData(msg: string): void {
    this.sockets.push({
      type: 'data',
      text: msg
    });
    utils.logData(msg);
  }

  logSuccess(msg: string): void {
    this.sockets.push({
      type: 'success',
      text: msg
    });
    utils.logSuccess(msg);
  }
}