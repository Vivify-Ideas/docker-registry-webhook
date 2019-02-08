import { SocketEvent } from '../../shared/sockets/typings/socket-event';
import processingService from './services/processing-service';
import { Notifier } from './notifications/notifier';
import { BuildWorker } from './worker/build-worker';
import { UserRepository } from './../../modules/user';
import { hasPermissionToManageProject } from './../../permissions';
import utils from './../../shared/utils';

const userRepository = new UserRepository();

export const events: SocketEvent[] = [
  {
    name: 'build',
    handler: ({ project: { projectName }, branch }) => {
      try {
        processingService.processWebhook({
          repositoryName: projectName,
          repositoryBranch: branch
        },
        new BuildWorker(),
        new Notifier());
      } catch(err) {
        utils.logError(err);
      }
    },
    hasPermissions: async (socket: SocketIO.Server, { project: { projectName }}): Promise<boolean> => {
      return await hasPermissionToManageProject(socket.user.email, projectName);
    } 
  }
]