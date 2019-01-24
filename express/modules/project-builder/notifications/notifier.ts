import http from 'http';
import url from 'url';

import utils from './../../../shared/utils';
import { Notifier as INotifier } from './typings/notifier';
import { Project } from './../../../shared/typings/project';

const REGISTRY_URL = process.env.REGISTRY_URL || 'registry.vivifyideas.com';

export class Notifier implements INotifier {
  notify(project: Project, images: string[], uri: string) {
    utils.logData(`Sending notification to ${uri}.`);
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
      JSON.stringify(
        {
          ...project,
          images: imagesDetails
        },
        null,
        4
      )
    );
    req.end();
  
    req.on('error', (error) => {
      utils.logError(`Got ERROR from Notify hook (${uri}) : ${error.toString()}`);
    });
  
    utils.logSuccess(`Sent Notify request to ${uri}`);
  }
}
