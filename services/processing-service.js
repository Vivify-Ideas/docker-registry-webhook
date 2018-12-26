const fs = require('fs');
const utils = require('./../utils');
const worker = require('./../modules/worker');
const notifier = require('./../modules/notifier');
const { Logger } = require('./../loggers/socket-console-logger');

const processWebhook = (webhookPayload, endCallback = () => {}) => {
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

  if (!project.dockerFiles) {
    return worker
      .execute(
        projectPath,
        project.namespace,
        'Dockerfile',
        webhookPayload.repositoryName,
        webhookPayload.repositoryBranch,
        project.slackWebhookUrl,
        new Logger(project.projectName, project.namespace)
      )
      .then((output) => {
        const msg = 'Webhook has been processed.';
        utils.logSuccess(msg);
        notifier.notify(
          project,
          [output.dockerImageName],
          project.branches[`${webhookPayload.repositoryBranch}`]
        );
        endCallback(msg);
      })
      .catch((err) => {
        utils.logError(`Error while processing webhook. ${err.toString()}`);
        endCallback(err.toString())
      });
  }

  const workerPromises = [];
  project.dockerFiles.forEach((dockerFile) =>
    workerPromises.push(
      worker.execute(
        projectPath,
        project.namespace,
        dockerFile.dockerFileName,
        webhookPayload.repositoryName,
        webhookPayload.repositoryBranch,
        project.slackWebhookUrl,
        new Logger(project.projectName, project.namespace),
        dockerFile.suffix
      )
    )
  );

  Promise.all(workerPromises)
    .then((output) => {
      const msg = 'Webhook has been processed.';
      const images = [];
      output.forEach((i) => images.push(i.dockerImageName));
      notifier.notify(project, images, project.branches[`${webhookPayload.repositoryBranch}`]);
      utils.logSuccess(msg);
      endCallback(msg);
    })
    .catch((err) => {
      utils.logError(`Error while processing webhook. ${err.toString()}`);
      endCallback(err.toString())
    });
};

module.exports = {
  processWebhook
};