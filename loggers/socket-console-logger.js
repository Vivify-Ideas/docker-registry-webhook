const utils = require('./../utils');
const { socketsServer } = require('./../sockets');

module.exports.Logger = class {
  constructor(projectName, namespace) {
    this.channel = `/logs/${projectName}/${namespace}`;
  }

  logError(data) {
    socketsServer.emit(this.channel, {
      type: 'error',
      text: data
    });
    utils.logError(data);
  }

  logData(data) {
    socketsServer.emit(this.channel, {
      type: 'data',
      text: data
    });
    utils.logData(data);
  }

  logSuccess(data) {
    socketsServer.emit(this.channel, {
      type: 'success',
      text: data
    });
    utils.logSuccess(data);
  }
}