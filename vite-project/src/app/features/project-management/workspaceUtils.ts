import type { ProjectStatus, ProjectTask, TaskStatus } from './types';

export function downloadWorkspaceJson(content: unknown, fileName: string) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function getNextProjectStatus(status: ProjectStatus): ProjectStatus {
  if (status === 'Planning') {
    return 'In Progress';
  }

  if (status === 'In Progress') {
    return 'Completed';
  }

  return 'Planning';
}

export function getNextTaskStatus(status: TaskStatus): TaskStatus {
  if (status === 'pending') {
    return 'in-progress';
  }

  if (status === 'in-progress') {
    return 'completed';
  }

  return 'pending';
}

export function getProjectTaskProgress(tasks: ProjectTask[]) {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTaskCount = tasks.filter((task) => task.status === 'completed').length;
  return Math.round((completedTaskCount / tasks.length) * 100);
}
