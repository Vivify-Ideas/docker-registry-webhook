const GithubParser = require('./github');

module.exports = {
  getGithubParser: () => {
    return new GithubParser();
  }
};
