const http = require('http');
const url = require('url');

const utils = require('./../utils');
const REGISTRY_URL = process.env.REGISTRY_URL || 'registry.vivifyideas.com';

const notify = (project, dockerImageName, uri) => {
  const options = {
    ...url.parse(uri),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const req = http.request(options, (res) => {
    res.setEncoding('utf8');

    res.on('data', (payload) => {
      utils.logSuccess(`Got response from Notify hook (${uri}) : ${payload}`);
    });
  });
  req.write(
    JSON.stringify({
      ...project,
      dockerImageName,
      registryUrl: REGISTRY_URL,
      fullUrl: `${REGISTRY_URL}/${dockerImageName}`
    })
  );
  req.end();

  req.on('error', (error) => {
    utils.logError(`Got ERROR from Notify hook (${uri}) : ${error.toString()}`);
  });

  utils.logSuccess(`Sent Notify request to ${uri}`);
};

module.exports = { notify };
