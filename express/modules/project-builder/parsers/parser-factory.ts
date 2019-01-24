import { GithubParser } from './github';
import { GitlabParser } from './gitlab';
import { HookParser } from './typings/parser';

export class ParserFactory {
  static getParser(url: string): HookParser {
    switch (url) {
      case 'github.com':
        return new GithubParser();
      case 'gitlab.com':
        return new GitlabParser();
      default:
        throw new Error('Unknown parser requested.');
    }
  }
};