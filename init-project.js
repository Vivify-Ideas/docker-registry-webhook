const fs = require('fs');
const utils = require('./utils');

const initProject = (projectName, repo, branch, webhook, namespace, slackWebhookUrl) => {
  const projectPath = utils.getProjectPath(projectName, branch);

  if (fs.existsSync(projectPath)) {
    throw new Error('Project already exists.');
  }

  const gitCloneCommand = `git clone ${repo} ${projectPath}`;
  const gitCloneError = 'Error while cloning GIT repo.';
  utils.logData(`Cloning git repository ${repo}..`);
  utils.execOrThrow(gitCloneCommand, gitCloneError);

  const gitCheckoutCommand = `cd ${projectPath}; git checkout ${branch}`;
  const gitCheckoutError = `Error while checkouting to  ${branch} branch.`;
  utils.logData(`Checkouting to ${branch}`);
  utils.execOrThrow(gitCheckoutCommand, gitCheckoutError);

  utils.writeToJson('./servers-list.json', projectName, branch, webhook, namespace, slackWebhookUrl);
  utils.logSuccess('Project has been initialized!');
};

const run = () => {
  const args = process.argv;

  if (args.length !== 8) {
    const msg = 'Usage: node init-project.js repoName repoUrl repoBranch webhookUrl namespace slackWebhookUrl';
    return utils.logError(msg);
  }

  initProject(...args.slice(2));
};

run();