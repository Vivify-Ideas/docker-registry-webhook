const fs = require('fs');
const utils = require('./../utils');
const serversList = require('./../servers-list.json');
const worker = require('./../modules/worker');
const notifier = require('./../modules/notifier');

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
        notifier.notify(
          project,
          [output.dockerImageName],
          project.branches[`${webhookPayload.repositoryBranch}`]
        );
      })
      .catch((err) => {
        utils.logError(`Error while processing webhook. ${err.toString()}`);
        res.end(err.toString());
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
      res.end(msg);
    })
    .catch((err) => {
      utils.logError(`Error while processing webhook. ${err.toString()}`);
      res.end(err.toString());
    });
};

module.exports = { processWebhook };
