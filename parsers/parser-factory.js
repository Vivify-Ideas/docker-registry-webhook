const GithubParser = require('./github');
const GitlabParser = require('./gitlab');

module.exports = {
  getParser: (url) => {
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