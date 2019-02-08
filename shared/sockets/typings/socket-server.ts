import { Server } from "http";

export interface SocketServer {
  connect(server: Server): void;
  addListener(event: string, handler: any): void;
  emit(channel: string, data: any): void;
}