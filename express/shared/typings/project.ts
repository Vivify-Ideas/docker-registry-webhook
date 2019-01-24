export interface Project {
  projectName: string;
  namespace: string;
  slackWebhookUrl: string;
  branches: {
    [key: string]: string
  },
  dockerFiles?: {
    dockerFileName: string,
    suffix: string
  }[]
}