const utils = require('./../utils');
const { socketsServer } = require('./../sockets');

const SEND_SOCKETS_IN_INTERVAL = 5000;

module.exports.Logger = class {
  constructor(projectName, namespace) {
    this.channel = `/logs/${projectName}/${namespace}`;
    this.sockets = [];
    this.interval = setInterval(() => {
      socketsServer.emit(this.channel, this.sockets);
      this.sockets = [];
    }, SEND_SOCKETS_IN_INTERVAL)
  }

  clear() {
    clearInterval(this.interval);
  }

  logError(data) {
    this.sockets.push({
      type: 'error',
      text: data
    });
    utils.logError(data);
  }

  logData(data) {
    this.sockets.push({
      type: 'data',
      text: data
    });
    utils.logData(data);
  }

  logSuccess(data) {
    this.sockets.push({
      type: 'success',
      text: data
    });
    utils.logSuccess(data);
  }
}