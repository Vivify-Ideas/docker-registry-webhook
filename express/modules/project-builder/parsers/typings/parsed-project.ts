export interface ParsedProject {
  repositoryId: string;
  repositoryName: string;
  repositoryFullName: string;
  repositoryUrl: string;
  repositoryBranch: string;
  isPrivate: boolean;
  updatedAt: string | null;
}