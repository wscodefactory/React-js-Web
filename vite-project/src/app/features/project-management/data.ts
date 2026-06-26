import { projectManagementProjects, projectManagementTasks } from '../../data/showcase';
import type { ProjectTask, ProjectWorkspaceDraft } from './types';

export const initialProjectTasks: ProjectTask[] = projectManagementTasks.map((task, index) => ({
  ...task,
  projectId: projectManagementProjects[index % projectManagementProjects.length].id,
  priority: index % 3 === 0 ? 'High' : index % 2 === 0 ? 'Low' : 'Medium',
  dueDate: index % 2 === 0 ? '2026-05-24' : '2026-05-30',
}));

export const fallbackProjectWorkspace: ProjectWorkspaceDraft = {
  projects: projectManagementProjects,
  selectedProjectId: projectManagementProjects[0].id,
  tasks: initialProjectTasks,
};
