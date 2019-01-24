export interface SocketEvent {
  name: string;
  handler(data: any): void;
};