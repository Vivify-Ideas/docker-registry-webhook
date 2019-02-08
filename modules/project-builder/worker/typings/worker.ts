import { Logger } from '../../../../shared/loggers/typings/logger';

export interface Worker {
  execute(
    projectPath: string,
    namespace: string,
    dockerFileName: string,
    repoName: string,
    branch: string,
    slackWebhookUrl: string,
    logger: Logger,
    suffix?: string
  ): Promise<any>
}