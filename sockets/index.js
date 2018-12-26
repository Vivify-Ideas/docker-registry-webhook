const io = require('socket.io');
const utils = require('../utils');

class Sockets {
  constructor() {
    this.socketServer = null;
  }

  connect(server) {
    this.socketServer = io(server);
  }

  getServer() {
    return this.socketServer;
  }

  emit(channel, data) {
    this.socketServer.emit(channel, data);
  }
}
let socketsServer = new Sockets();

module.exports.socketsServer = socketsServer;

module.exports.connectSockets = (server) => {
  socketsServer.connect(server);
  socketsServer.getServer().on('connection', function(socket){
    socket.emit('projects', utils.serversList)

    const { events } = require('./events');
    events.forEach((event) => {
      socket.on(event.name, event.handler);
    });
  });
}