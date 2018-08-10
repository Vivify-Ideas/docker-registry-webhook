class GitlabParser {
    constructor() {}

    parse(webhookPayload) {
        const branch = webhookPayload.ref.split('/')[2];
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