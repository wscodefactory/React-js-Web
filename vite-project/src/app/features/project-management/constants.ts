import type { ProjectStatus, TaskFilter, TaskPriority, TaskStatus } from './types';

export const projectWorkspaceStorageKey = 'web5:project-management-workspace:v1';

export const projectStatuses: ProjectStatus[] = ['Planning', 'In Progress', 'Completed'];

export const taskStatuses: TaskStatus[] = ['pending', 'in-progress', 'completed'];

export const taskPriorities: TaskPriority[] = ['High', 'Medium', 'Low'];

export const taskFilters: TaskFilter[] = ['all', 'pending', 'in-progress', 'completed'];

export const projectStatusClassMap: Record<ProjectStatus, string> = {
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Planning: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

export const taskStatusClassMap: Record<TaskStatus, string> = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

export const taskPriorityClassMap: Record<TaskPriority, string> = {
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};
