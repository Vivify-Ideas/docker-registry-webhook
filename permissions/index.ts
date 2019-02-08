import { UserRepository } from './../modules/user';
import { Project } from './../shared/typings/project';

const userRepository = new UserRepository();

export async function hasPermissionToManageProject(email: string, projectName: string) {
  const user = await userRepository.findOne({ email });
  return user.is_admin || user.projects.indexOf(projectName) > -1;
}

export async function filterUsersProjects(email: string, projects: Project[]): Promise<Project[]> {
  const user = await userRepository.findOne({ email });
  if (!user.is_admin) {
    return projects.filter((project) => {
      return user.projects.indexOf(project.projectName) !== -1;
    })
  }

  return projects;
}