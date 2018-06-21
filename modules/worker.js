const utils = require('./../utils');
const spawn = require('child_process').spawn;
const serversList = require('./../servers-list.json');
const REGISTRY_URL = process.env.REGISTRY_URL || 'registry.vivifyideas.com';

const execute = (projectPath, namespace, dockerFileName, repoName, branch, suffix = '') => {
  return new Promise((resolve, reject) => {
    let dockerImageName = '';
    try {
      const gitPull = `cd ${projectPath}; git pull`;
      dockerImageName = suffix === '' ? `${repoName}:${branch}` : `${repoName}-${suffix}:${branch}`;
      const dockerBuild = `cd ${projectPath}; docker build --no-cache -t ${dockerImageName} -f ${dockerFileName} .`;
      const dockerTag = `docker tag ${dockerImageName} ${REGISTRY_URL}/${namespace}/${dockerImageName}`;
      const dockerPush = `docker push ${REGISTRY_URL}/${namespace}/${dockerImageName}`;

      const child = spawn(`${gitPull} && ${dockerBuild} && ${dockerTag} && ${dockerPush}`, {
        shell: true
      });

      child.stderr.on('data', (data) => {
        utils.logError(`STDERR: ${data.toString()}`);
      });

      child.stdout.on('data', (data) => {
        utils.logData(`STDOUT: ${data.toString()}`);
      });

      child.on('exit', (exitCode) => {
        const msg = 'Child exited with code: ' + exitCode;
        if (exitCode === 0) {
          const successMsg = `Worker finished all commands successfully on image ${dockerImageName}.`;
          utils.logSuccess(successMsg);
          return resolve({ message: successMsg, dockerImageName });
        }
        return reject(msg);
      });
    } catch (e) {
      return reject(e);
    }
  });
};

module.exports = { execute };
