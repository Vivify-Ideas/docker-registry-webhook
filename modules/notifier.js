const http = require('http');
const url = require('url');

const utils = require('./../utils');
const REGISTRY_URL = process.env.REGISTRY_URL || 'registry.vivifyideas.com';

const notify = (project, images, uri) => {
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

  const imagesDetails = images.map((image) => {
    return {
      name: image,
      registryUrl: REGISTRY_URL,
      fullUrl: `${REGISTRY_URL}/${image}`
    };
  });
  req.write(
    JSON.stringify({
      ...project,
      images: imagesDetails
    })
  );
  req.end();

  req.on('error', (error) => {
    utils.logError(`Got ERROR from Notify hook (${uri}) : ${error.toString()}`);
  });

  utils.logSuccess(`Sent Notify request to ${uri}`);
};

module.exports = { notify };
