const http = require('http');
const utils = require('./utils');

const PORT = process.env.PORT || 8089;
const server = http.createServer();

server.listen(PORT, () => {
  utils.logSuccess(`Dockerhub watcher is up on port ${PORT}.`);
});

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
