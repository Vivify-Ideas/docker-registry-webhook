class GithubParser {
  constructor() {}

  parse(webhookPayload) {
    const refParts = webhookPayload.ref.split('/');
    const branch = refParts.splice(2, refParts.length).join('/');

    return {
      repositoryId: webhookPayload.repository.id,
      repositoryName: webhookPayload.repository.name,
      repositoryFullName: webhookPayload.repository.full_name,
      repositoryUrl: webhookPayload.repository.url,
      repositoryBranch: branch,
      isPrivate: webhookPayload.repository.private,
      updatedAt: webhookPayload.repository.updated_at
    };
  }
}

module.exports = GithubParser;
