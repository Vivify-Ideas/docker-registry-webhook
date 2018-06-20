const GithubParser = require('./github');

module.exports = {
  getParser: (url) => {
    switch (url) {
      case 'github.com':
        return new GithubParser();
        break;
      default:
        throw new Error('Unknown parser requested.');
    }
  }
};
