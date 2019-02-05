import fs from 'fs';
import utils from './../../../shared/utils';
import { SocketConsoleLogger } from './../../../shared/loggers/socket-console-logger';
import { Notifier } from '../notifications/typings/notifier';
import { Worker } from '../worker/typings/worker';
import { ParsedProject } from '../parsers/typings/parsed-project';

const processWebhook = (webhookPayload: ParsedProject, worker: Worker, notifier: Notifier, endCallback: any = () => {}) => {
  utils.logData('Starting webhook processing..');
  webhookPayload.repositoryName = webhookPayload.repositoryName.toLowerCase();
  const project = utils.getProjectByName(webhookPayload.repositoryName);
  const projectPath = utils.getProjectPath(
    webhookPayload.repositoryName,
    webhookPayload.repositoryBranch
  );

  if (!project || !fs.existsSync(projectPath)) {
    throw new Error('Project with that name (or on that branch) does not exist.');
  }

  const logger = new SocketConsoleLogger(project.projectName, project.namespace);

  if (!project.dockerFiles) {
    return worker
      .execute(
        projectPath,
        project.namespace,
        'Dockerfile',
        webhookPayload.repositoryName,
        webhookPayload.repositoryBranch,
        project.slackWebhookUrl,
        logger
      )
      .then((output) => {
        const msg = 'Webhook has been processed.';
        utils.logSuccess(msg);
        notifier.notify(
          project,
          [output.dockerImageName],
          project.branches[`${webhookPayload.repositoryBranch}`]
        );
        logger.clear();
        endCallback(msg);
      })
      .catch((err) => {
        logger.clear();
        utils.logError(`Error while processing webhook. ${err.toString()}`);
        endCallback(err.toString())
      });
  }

  let workerPromises: Promise<any>[] = [];
  project.dockerFiles.forEach((dockerFile: any) =>
    workerPromises.push(
      worker.execute(
        projectPath,
        project.namespace,
        dockerFile.dockerFileName,
        webhookPayload.repositoryName,
        webhookPayload.repositoryBranch,
        project.slackWebhookUrl,
        logger,
        dockerFile.suffix
      )
    )
  );

  return Promise.all(workerPromises)
    .then((output) => {
      const msg = 'Webhook has been processed.';
      const images: string[] = [];
      output.forEach((i) => images.push(i.dockerImageName));
      notifier.notify(project, images, project.branches[`${webhookPayload.repositoryBranch}`]);
      utils.logSuccess(msg);
      logger.clear();
      endCallback(msg);
    })
    .catch((err) => {
      utils.logError(`Error while processing webhook. ${err.toString()}`);
      logger.clear();
      endCallback(err.toString())
    });
};

export default {
  processWebhook
};