import type { AppLanguage } from '../../context/LanguageContext';
import type { ProjectOverview, TaskItem } from '../../types/showcase';

export type ProjectStatus = ProjectOverview['status'];
export type TaskStatus = TaskItem['status'];
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskFilter = 'all' | TaskStatus;

export type ProjectTask = TaskItem & {
  projectId: number;
  priority: TaskPriority;
  dueDate: string;
};

export type ProjectWorkspaceDraft = {
  projects: ProjectOverview[];
  selectedProjectId: number;
  tasks: ProjectTask[];
};

export type ProjectWorkspaceState = {
  restored: boolean;
  workspace: ProjectWorkspaceDraft;
};

export type ProjectManagementText = {
  activeProjects: string;
  addProject: string;
  addProjectTitle: string;
  addTask: string;
  addTaskTitle: string;
  assignee: string;
  assigneePlaceholder: string;
  controlsDescription: string;
  controlsTitle: string;
  deadline: string;
  delete: string;
  exportWorkspace: string;
  metrics: {
    activeProjects: string;
    averageProgress: string;
    openTasks: string;
    teamMembers: string;
  };
  messages: {
    createProjectFirst: string;
    createTaskFirst: string;
    keepOneProject: string;
    projectCreated: (name: string) => string;
    projectRemoved: (name: string) => string;
    projectReset: string;
    projectStatusMoved: (name: string, status: string) => string;
    ready: string;
    restored: string;
    taskAdded: (title: string, projectName: string) => string;
    taskRemoved: (title: string) => string;
    taskRemovedFallback: string;
    taskUpdated: string;
    workspaceReady: string;
  };
  moveStatus: string;
  noTasks: string;
  pageDescription: string;
  pageHighlight: string;
  pageTitle: string;
  priority: string;
  progress: string;
  projectName: string;
  projectNamePlaceholder: string;
  resetWorkspace: string;
  selected: string;
  statusAdvance: string;
  taskCompletion: (progress: number, count: number) => string;
  taskCount: (count: number) => string;
  taskQueueDescription: (projectName: string, count: number) => string;
  taskQueueTitle: string;
  taskTitle: string;
  taskTitlePlaceholder: string;
  team: string;
  teamMembers: (count: number) => string;
};

export type ProjectManagementCopy = Record<AppLanguage, ProjectManagementText>;
