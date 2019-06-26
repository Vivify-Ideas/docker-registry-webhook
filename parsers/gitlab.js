class GitlabParser {
  constructor() {}

  parse(webhookPayload) {
    const refParts = webhookPayload.ref.split('/');
    const branch = refParts.splice(2, refParts.length).join('/');

    return {
      repositoryId: webhookPayload.project_id,
      repositoryName: webhookPayload.repository.name,
      repositoryFullName: webhookPayload.repository.name,
      repositoryUrl: webhookPayload.repository.url,
      repositoryBranch: branch,
      isPrivate: webhookPayload.repository.visibility_level === 0,
      updatedAt: null
    };
  }
}

module.exports = GitlabParser;
