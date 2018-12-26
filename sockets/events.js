const processingService = require('./../services/processing-service');

module.exports.events = [
  {
    name: 'build',
    handler: ({ project: { projectName }, branch }) => {
      processingService.processWebhook({
        repositoryName: projectName,
        repositoryBranch: branch
      });
    }
  }
]