import io, { Server } from 'socket.io';
import { Server as HTTPServer } from 'http'
import { SocketServer } from './typings/socket-server';
import { events } from '../../modules/project-builder/events.socket';
import utils from './../utils';
import socketIOJWT from 'socketio-jwt';
import configuration from './../../configuration';
import { filterUsersProjects } from './../../permissions';

export class Sockets implements SocketServer {
  socketServer: Server = null;

  connect(server: HTTPServer): void {
    this.socketServer = io(server);
  }

  addListener(event: string, handler: any): io.Namespace {
    return this.socketServer.on(event, handler);
  }

  emit(channel: string, data: any): void {
    this.socketServer.emit(channel, data);
  }
}
let socketsServer = new Sockets();
export const SocketsServer = socketsServer;

export function connectSockets(server: HTTPServer) {
  socketsServer.connect(server);
  socketsServer.addListener('connection', socketIOJWT.authorize({
    secret: configuration.JWT_SECRET_KEY,
    decodedPropertyName: 'user',
    timeout: 15000
  })).on('authenticated', async (socket: SocketIO.Server) => {
    const projects = await filterUsersProjects(socket.user.email, utils.serversList);
    socket.emit('projects', projects)

    events.forEach((event) => {
      socket.on(event.name, async (data: any) => {
        const hasPermission = await event.hasPermissions(socket, data);
        if (hasPermission) {
          event.handler(data);
        }
      });
    });
  })
}