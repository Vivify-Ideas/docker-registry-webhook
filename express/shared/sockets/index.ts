import io, { Server } from 'socket.io';
import { Server as HTTPServer } from 'http'
import { SocketServer } from './typings/socket-server';
import { events } from '../../modules/project-builder/events.socket';
// Events should be moved from here
import utils from './../utils';

// Probably module it self should add events to the sockets
export class Sockets implements SocketServer {
  socketServer: Server = null;

  connect(server: HTTPServer): void {
    this.socketServer = io(server);
  }

  addListener(event: string, handler: any): void {
    this.socketServer.on('connection', handler);
  }

  emit(channel: string, data: any): void {
    this.socketServer.emit(channel, data);
  }
}
let socketsServer = new Sockets();
export const SocketsServer = socketsServer;

export function connectSockets(server: HTTPServer) {
  socketsServer.connect(server);
  socketsServer.addListener('connection', function(socket: SocketIO.Socket){
    socket.emit('projects', utils.serversList)

    events.forEach((event) => {
      socket.on(event.name, event.handler);
    });
  })
}