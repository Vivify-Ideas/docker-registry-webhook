export interface SocketEvent {
  name: string;
  handler(data: any): void;
  hasPermissions(socket: SocketIO.Server, data: any): Promise<boolean>;
};