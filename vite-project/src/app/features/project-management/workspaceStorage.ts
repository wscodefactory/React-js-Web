import type { ProjectOverview } from '../../types/showcase';
import { projectStatuses, projectWorkspaceStorageKey, taskPriorities, taskStatuses } from './constants';
import { fallbackProjectWorkspace } from './data';
import type { ProjectStatus, ProjectTask, ProjectWorkspaceDraft, ProjectWorkspaceState, TaskPriority, TaskStatus } from './types';

function isProjectOverview(value: unknown): value is ProjectOverview {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ProjectOverview>;
  return typeof candidate.id === 'number'
    && typeof candidate.name === 'string'
    && projectStatuses.includes(candidate.status as ProjectStatus)
    && typeof candidate.progress === 'number'
    && typeof candidate.team === 'number'
    && typeof candidate.deadline === 'string';
}

function isProjectTask(value: unknown): value is ProjectTask {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ProjectTask>;
  return typeof candidate.id === 'number'
    && typeof candidate.projectId === 'number'
    && typeof candidate.title === 'string'
    && typeof candidate.assignee === 'string'
    && taskStatuses.includes(candidate.status as TaskStatus)
    && taskPriorities.includes(candidate.priority as TaskPriority)
    && typeof candidate.dueDate === 'string';
}

export function readStoredProjectWorkspace(): ProjectWorkspaceState {
  if (typeof window === 'undefined') {
    return { restored: false, workspace: fallbackProjectWorkspace };
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(projectWorkspaceStorageKey) ?? 'null') as Partial<ProjectWorkspaceDraft> | null;

    if (
      !parsed
      || !Array.isArray(parsed.projects)
      || !Array.isArray(parsed.tasks)
      || parsed.projects.length === 0
      || !parsed.projects.every(isProjectOverview)
      || !parsed.tasks.every(isProjectTask)
    ) {
      return { restored: false, workspace: fallbackProjectWorkspace };
    }

    const selectedProjectId = parsed.projects.some((project) => project.id === parsed.selectedProjectId)
      ? Number(parsed.selectedProjectId)
      : parsed.projects[0].id;

    return {
      restored: true,
      workspace: {
        projects: parsed.projects,
        selectedProjectId,
        tasks: parsed.tasks.filter((task) => parsed.projects?.some((project) => project.id === task.projectId)),
      },
    };
  } catch {
    return { restored: false, workspace: fallbackProjectWorkspace };
  }
}
