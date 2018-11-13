const utils = require('./../utils');
const spawn = require('child_process').spawn;
const serversList = require('./../servers-list.json');
const REGISTRY_URL = process.env.REGISTRY_URL || 'registry.vivifyideas.com';

const execute = (projectPath, namespace, dockerFileName, repoName, branch, slackWebhookUrl, suffix = '') => {
  return new Promise((resolve, reject) => {
    const dockerImageName =
      suffix === '' ? `${repoName}:${branch}` : `${repoName}-${suffix}:${branch}`;
    wipeOldBuilds(dockerImageName);
    wipeOldBuilds(`${REGISTRY_URL}/${namespace}/${dockerImageName}`);
    try {
      utils.notifySlack(slackWebhookUrl, `Starting with ${dockerImageName} build.`);
      const gitPull = `cd ${projectPath}; git pull`;
      const dockerBuild = `cd ${projectPath}; docker build --no-cache --build-arg BUILD_IMAGE_TAG=${branch} --build-arg BUILD_IMAGE=${dockerImageName} -t ${dockerImageName} -f ${dockerFileName} .`;
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
          const message = `Build Worker finished all commands successfully on image ${dockerImageName}.`;
          utils.notifySlack(slackWebhookUrl, message);
          utils.logSuccess(message);
          return resolve({
            message,
            dockerImageName
          });
        }
        utils.notifySlack(slackWebhookUrl, `Build failed for image ${dockerImageName} with exit code ${exitCode}.`);
        return reject(msg);
      });
    } catch (e) {
      return reject(e);
    }
  });
};

const wipeOldBuilds = (image) =>
  utils.execBashAndLog(`docker rmi $(docker images -q ${image} | tail -n+2)`);

module.exports = {
  execute
};