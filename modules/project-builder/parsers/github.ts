import { HookParser } from './typings/parser';
import { ParsedProject } from './typings/parsed-project';

export class GithubParser implements HookParser {
  constructor() {}

  parse(webhookPayload: any): ParsedProject {
    const branch = webhookPayload.ref.split('/')[2];
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

