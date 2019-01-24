import { SocketEvent } from '../../shared/sockets/typings/socket-event';
import processingService from './services/processing-service';
import { Notifier } from './notifications/notifier';
import { BuildWorker } from './worker/build-worker';

export const events: SocketEvent[] = [
  {
    name: 'build',
    handler: ({ project: { projectName }, branch }) => {
      processingService.processWebhook({
        repositoryName: projectName,
        repositoryBranch: branch
      },
      new BuildWorker(),
      new Notifier());
    }
  }
]