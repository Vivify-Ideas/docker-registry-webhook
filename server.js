const http = require('http');
const utils = require('./utils');
const parserFactory = require('./parsers/parser-factory');
const processingService = require('./services/processing-service');
const { connectSockets } = require('./sockets');

const PORT = process.env.PORT || 8089;
const server = http.createServer();

connectSockets(server);
server.listen(PORT, () => {
  utils.logSuccess(`Dockerhub watcher is up on port ${PORT}.`);
});

const methodNotAllowed = (res) => {
  res.writeHead(405);
  return res.end('Only POST method is allowed.');
};

server.on('request', (req, res) => {

  if (req.url.indexOf('socket.io')) {
    return;
  }

  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  let bufferPayload = '';

  req.on('data', (chunk) => (bufferPayload += chunk));

  req.on('end', () => {
    if (!bufferPayload || utils.isEmptyObj(JSON.parse(bufferPayload))) {
      return res.end('Empty payload.');
    }
    const payload = JSON.parse(bufferPayload.toString());
    const parser = utils.getGitServiceFromUrl(payload.repository.url);
    const parsedWebhookPayload = parserFactory.getParser(parser).parse(payload);
    utils.logSuccess('Parsed Webhook payload.');
    try {
      const payload = JSON.parse(bufferPayload.toString());
      const parser = utils.getGitServiceFromUrl(payload.repository.url);
      const parsedWebhookPayload = parserFactory.getParser(parser).parse(payload);
      utils.logSuccess('Parsed Webhook payload.');
      processingService.processWebhook(parsedWebhookPayload, (msg) => {
        res.end(msg);
      });
    } catch (e) {
      utils.logError(e.toString());
      res.end(e.toString());
    }
  });
});