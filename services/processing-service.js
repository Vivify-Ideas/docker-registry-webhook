const fs = require('fs');
const utils = require('./../utils');
const serversList = require('./../servers-list.json');
const worker = require('./../modules/worker');

const processWebhook = (webhookPayload, res) => {
  utils.logData('Starting webhook processing..');
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
        webhookPayload.repositoryBranch
      )
      .then((output) => {
        utils.logSuccess(`Webhook has been processed.`);
        res.end(output);
      })
      .catch((err) => {
        utils.logError('Error while processing webhook.', err);
        res.end(err);
      });
  }

  let workerPromises = [];
  project.dockerFiles.forEach((dockerFile) =>
    workerPromises.push(
      worker.execute(
        projectPath,
        project.namespace,
        dockerFile.dockerFileName,
        webhookPayload.repositoryName,
        webhookPayload.repositoryBranch,
        dockerFile.suffix
      )
    )
  );

  Promise.all(workerPromises)
    .then((output) => {
      const msg = 'Webhook has been processed.';
      utils.logSuccess(msg);
      res.end(msg);
    })
    .catch((err) => {
      utils.logError(`Error while processing webhook. ${err.toString()}`);
      res.end(err);
    });
};

module.exports = { processWebhook };
