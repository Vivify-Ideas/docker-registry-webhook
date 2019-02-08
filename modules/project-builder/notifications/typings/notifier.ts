export interface Notifier {
  notify(project: any, images: string[], uri: string): void;
}