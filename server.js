const http = require('http');
const utils = require('./utils');
const parserFactory = require('./parsers/parser-factory');
const processingService = require('./services/processing-service');

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
    const parser = utils.getGitServiceFromUrl(payload.repository.url);
    const parsedWebhookPayload = parserFactory.getParser(parser).parse(payload);
    utils.logSuccess('Parsed Webhook payload.');
    processingService.processWebhook(parsedWebhookPayload, res);
  });
});
