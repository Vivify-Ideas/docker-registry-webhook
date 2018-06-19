const http = require('http');
const exec = require('child_process');

const PORT = process.env.PORT || 8089;
const server = http.createServer();

server.listen(PORT, () => {
  logSuccess(`Dockerhub watcher is up on port ${PORT}.`);
});

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

const methodNotAllowed = (res) => {
  res.writeHead(405);
  return res.end('Only POST method is allowed.');
};

const malformedRequest = (res) => {
  res.writeHead(400);
  return res.end('Malformed request data.');
};

server.on('request', (req, res) => {
  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  req.on('data', (data) => {
    const payload = JSON.parse(data.toString());
  });
});
