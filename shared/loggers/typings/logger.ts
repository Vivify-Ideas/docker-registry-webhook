export interface Logger {
  logError(data: string): void;
  logSuccess(data: string): void;
  logData(data: string): void;
}