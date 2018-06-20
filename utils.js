const exec = require('child_process');
const fs = require('fs');

const serversList = require('./servers-list.json');

const logSuccess = (message) => {
  console.log('\x1b[32m', message, '\x1b[0m');
};

const logData = (message) => {
  console.log('\x1b[37m', message, '\x1b[0m');
};

const logError = (message) => {
  console.log('\033[31m', message, '\x1b[0m');
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

const writeToJson = (jsonFile, projectName, branch, repo) => {
  const obj = {
    projectName,
    branches: {}
  };

  obj.branches[`${branch}`] = repo;

  serversList.push(obj);

  return fs.writeFileSync(jsonFile, JSON.stringify(serversList, null, 4));
};

module.exports = {
  logSuccess,
  logData,
  logError,
  execBashAndLog,
  execOrThrow,
  writeToJson
};
