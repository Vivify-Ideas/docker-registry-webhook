const utils = require('./../utils');
const serversList = require('./../servers-list.json');
const REGISTRY_URL = process.env.REGISTRY_URL || 'registry.vivifyideas.com';

const execute = (projectPath, namespace, dockerFileName, repoName, branch, suffix = '') => {
  return new Promise((resolve, reject) => {
    let dockerImageName = '';
    try {
      const gitPull = `cd ${projectPath}; git pull`;
      const gitPullError = 'Error while pulling from git repository.';
      utils.logData(`Git pull on repo ${repoName} at branch ${branch}.`);
      utils.execOrThrow(gitPull);

      dockerImageName = suffix === '' ? `${repoName}:${branch}` : `${repoName}-${suffix}:${branch}`;
      const dockerBuild = `cd ${projectPath}; docker build --no-cache -t ${dockerImageName} -f ${dockerFileName} .`;
      const dockerBuildError = 'Error while building docker image.';
      utils.logData(`Building docker image ${dockerImageName}.`);
      utils.execOrThrow(dockerBuild);

      const dockerTag = `docker tag ${dockerImageName} ${REGISTRY_URL}/${namespace}/${dockerImageName}`;
      const dockerTagError = 'Error while tagging docker image.';
      utils.logData('Tagging docker image.');
      utils.execOrThrow(dockerTag);

      const dockerPush = `docker push ${REGISTRY_URL}/${namespace}/${dockerImageName}`;
      const dockerPushError = 'Error while pushing docker image.';
      utils.logData(`Pushing image ${dockerImageName} to docker repo.`);
      utils.execOrThrow(dockerPush);
    } catch (e) {
      return reject(e);
    }

    const successMsg = `Worker finished all commands successfully on image ${dockerImageName}.`;
    utils.logSuccess(successMsg);
    return resolve({ message: successMsg, dockerImageName });
  });
};

module.exports = { execute };
