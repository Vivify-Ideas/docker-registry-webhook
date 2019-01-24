import exec from 'child_process';
import fs from 'fs';
import {
  IncomingWebhook
} from'@slack/client';
import { Project } from './typings/project';

const serversList: Project[] = require('./../servers-list.json');

const logTimestamp = () => {
  return `[${new Date().toUTCString()}]`;
};

const logSuccess = (message: string) => {
  console.log('\x1b[32m', `${logTimestamp()} ${message}`, '\x1b[0m');
};

const logData = (message: string) => {
  console.log('\x1b[37m', `${logTimestamp()} ${message}`, '\x1b[0m');
};

const logError = (message: string) => {
  console.log('\x1b[31m', `${logTimestamp()} ${message}`, '\x1b[0m');
};

const execBashAndLog = (command: string) => {
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

const execOrThrow = (command: string, errorMessage: string) => {
  const output = execBashAndLog(command);

  if (!output) {
    throw new Error(errorMessage);
  }

  return output;
};

const writeToJson = (jsonFile: string, projectName: string, branch: string, webhook: string, namespace: string, slackWebhookUrl: string) => {
  if (getProjectByName(projectName)) {
    return addBranchToServerList(jsonFile, projectName, branch, webhook);
  }

  const obj: Project = { // Refactor this
    projectName,
    namespace,
    branches: {},
    slackWebhookUrl
  };

  obj.branches[`${branch}`] = webhook; 

  serversList.push(obj);

  return fs.writeFileSync(jsonFile, JSON.stringify(serversList, null, 4));
};

const addBranchToServerList = (jsonFile: string, project: string, branch: string, webhook: string) => {
  const serversListLength = serversList.length;
  for (let i = 0; i < serversListLength; ++i) {
    if (serversList[i].projectName === project) {
      serversList[i].branches[`${branch}`] = webhook;
      break;
    }
  }
  return fs.writeFileSync(jsonFile, JSON.stringify(serversList, null, 4));
};

const getGitServiceFromUrl = (url: string) => {
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

const getProjectByName = (name: string): Project => serversList.find((p: any) => p.projectName === name);

const getProjectPath = (name: string, branch: string) => `${require('os').homedir()}/${name}-${branch}`;

const isEmptyObj = (obj: any) => Object.keys(obj).length === 0;

const notifySlack = (webhookUrl: string, text: string) => {
  if (!webhookUrl) {
    return;
  }
  const webhook = new IncomingWebhook(webhookUrl);
  return new Promise((resolve, reject) =>
    webhook.send(text, (err, res) => err ? reject(err) : resolve(res)));
};

export default {
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