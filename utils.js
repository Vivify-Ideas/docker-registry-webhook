const exec = require('child_process');
const fs = require('fs');
const {
  IncomingWebhook
} = require('@slack/client');

const serversList = require('./servers-list.json');

const logTimestamp = () => {
  return `[${new Date().toUTCString()}]`;
};

const logSuccess = (message) => {
  console.log('\x1b[32m', `${logTimestamp()} ${message}`, '\x1b[0m');
};

const logData = (message) => {
  console.log('\x1b[37m', `${logTimestamp()} ${message}`, '\x1b[0m');
};

const logError = (message) => {
  console.log('\033[31m', `${logTimestamp()} ${message}`, '\x1b[0m');
};

const execBashAndLog = (command) => {
  try {
    const output = exec
      .execSync(command, {
        shell: '/bin/bash'
      })
      .toString();
    logData(output);
    return output || true;
  } catch (ex) {
    logError(ex);
    return false;
  }
};

const execOrThrow = (command, errorMessage) => {
  const output = execBashAndLog(command);

  if (!output) {
    throw new Error(errorMessage);
  }

  return output;
};

const writeToJson = (jsonFile, projectName, branch, webhook, namespace, slackWebhookUrl) => {
  if (getProjectByName(projectName)) {
    return addBranchToServerList(jsonFile, projectName, branch, webhook);
  }

  const obj = {
    projectName,
    namespace,
    branches: {},
    slackWebhookUrl
  };

  obj.branches[`${branch}`] = webhook;

  serversList.push(obj);

  return fs.writeFileSync(jsonFile, JSON.stringify(serversList, null, 4));
};

const addBranchToServerList = (jsonFile, project, branch, webhook) => {
  const serversListLength = serversList.length;
  for (let i = 0; i < serversListLength; ++i) {
    if (serversList[i].projectName === project) {
      serversList[i].branches[`${branch}`] = webhook;
      break;
    }
  }
  return fs.writeFileSync(jsonFile, JSON.stringify(serversList, null, 4));
};

const getGitServiceFromUrl = (url) => {
  return url.includes('https://') ?
    url
    .split('://')
    .pop()
    .split('/')
    .shift() :
    url
    .split('git@')
    .pop()
    .split(':')
    .shift();
};

const getProjectByName = (name) => serversList.find((p) => p.projectName === name);

const getProjectPath = (name, branch) => `${require('os').homedir()}/${name}-${branch}`;

const isEmptyObj = (obj) => Object.keys(obj).length === 0;

const notifySlack = (webhookUrl, text) => {
  if (!webhookUrl) {
    return;
  }
  const webhook = new IncomingWebhook(webhookUrl);
  return new Promise((resolve, reject) =>
    webhook.send(text, (err, res) => err ? reject(err) : resolve(res)));
};

module.exports = {
  logSuccess,
  logData,
  logError,
  execBashAndLog,
  execOrThrow,
  writeToJson,
  getGitServiceFromUrl,
  getProjectByName,
  getProjectPath,
  isEmptyObj,
  notifySlack,
  serversList
};