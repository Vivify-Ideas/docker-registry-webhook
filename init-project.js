const fs = require('fs');
const utils = require('./utils');

const initProject = (projectName, repo, branch) => {
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

  utils.writeToJson('./servers-list.json', projectName, branch, repo);
  utils.logSuccess('Project has been initialized!');
};

const run = () => {
  const args = process.argv;

  if (args.length !== 5) {
    const msg = 'Usage: node init-project.js projectName repoUrl branch';
    return utils.logError(msg);
  }

  initProject(args[2], args[3], args[4]);
};

run();
