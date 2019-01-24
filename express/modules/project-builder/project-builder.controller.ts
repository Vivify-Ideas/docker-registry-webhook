import { ParserFactory } from './parsers/parser-factory';
import utils from './../../shared/utils';
import processingService from './services/processing-service';
import { BuildWorker } from './worker/build-worker';
import { Notifier } from './notifications/notifier';

/**
 * Controlls the running of project build
 * @class ProjectBuilderController
 */
export class ProjectBuilderController {
  /**
   * Stats the build of the project, this method receive the
   * body which is a payload of the service (github, gitlab etc..)
   * @method startBuild
   * @param paylod {any}
   * @returns Promise<any>
   */
  startBuild(payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const parser = utils.getGitServiceFromUrl(payload.repository.url);
        const parsedWebhookPayload = ParserFactory.getParser(parser).parse(payload);
        utils.logSuccess('Parsed Webhook payload.');
        processingService.processWebhook(
          parsedWebhookPayload,
          new BuildWorker(),
          new Notifier(),
          (msg: string) => {
            resolve(msg);
          });
      } catch (e) {
        utils.logError(e.toString());
        reject(e.toString());
      }
    })
  }
}