const exec = require('child_process');

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
    logData(
      exec
        .execSync(command, {
          shell: '/bin/bash'
        })
        .toString()
    );
  } catch (ex) {
    logError(ex);
  }
};

module.exports = { logSuccess, logData, logError, execBashAndLog };
