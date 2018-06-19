const fs = require('fs');
const utils = require('./utils');

const initProject = (projectName, repo, branch, webhook) => {
  const homedir = require('os').homedir();
  const projectPath = `${homedir}/${projectName}-${branch}`;

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

  utils.writeToJson('./servers-list.json', projectName, branch, webhook);
  utils.logSuccess('Project has been initialized!');
};

const run = () => {
  const args = process.argv;

  if (args.length !== 6) {
    const msg = 'Usage: node init-project.js repoName repoUrl repoBranch webhookUrl';
    return utils.logError(msg);
  }

  initProject(args[2], args[3], args[4], args[5]);
};

run();
