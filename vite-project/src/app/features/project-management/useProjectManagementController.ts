import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Flag, Users } from 'lucide-react';
import type { ProjectOverview } from '../../types/showcase';
import { useLanguage } from '../../context/LanguageContext';
import { removeStoredValue, saveStoredJson } from '../../utils/storage';
import { projectManagementCopy, getProjectDisplayText, projectStatusLabels } from './copy';
import { projectWorkspaceStorageKey } from './constants';
import { fallbackProjectWorkspace } from './data';
import { readStoredProjectWorkspace } from './workspaceStorage';
import { downloadWorkspaceJson, getNextProjectStatus, getNextTaskStatus } from './workspaceUtils';
import type { ProjectTask, TaskFilter, TaskPriority } from './types';

export function useProjectManagementController() {
  const { language } = useLanguage();
  const projectText = projectManagementCopy[language];
  const [storedWorkspace] = useState(() => readStoredProjectWorkspace());
  const [projects, setProjects] = useState<ProjectOverview[]>(storedWorkspace.workspace.projects);
  const [tasks, setTasks] = useState<ProjectTask[]>(storedWorkspace.workspace.tasks);
  const [selectedProjectId, setSelectedProjectId] = useState(storedWorkspace.workspace.selectedProjectId);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [newTaskTitle, setNewTaskTitle] = useState(() => getProjectDisplayText(language, 'Prepare stakeholder update'));
  const [newTaskAssignee, setNewTaskAssignee] = useState(() => getProjectDisplayText(language, 'Mina'));
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newProjectName, setNewProjectName] = useState(() => getProjectDisplayText(language, 'Customer Portal'));
  const [newProjectTeam, setNewProjectTeam] = useState(4);
  const [newProjectDeadline, setNewProjectDeadline] = useState('2026-06-30');
  const [statusMessage, setStatusMessage] = useState<string>(storedWorkspace.restored
    ? projectText.messages.restored
    : projectText.messages.ready);

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];
  const selectedProjectTasks = tasks.filter((task) => task.projectId === selectedProject.id);
  const visibleTasks = selectedProjectTasks.filter((task) => taskFilter === 'all' || task.status === taskFilter);

  const taskCountsByProject = useMemo(() => {
    return tasks.reduce<Record<number, number>>((result, task) => {
      result[task.projectId] = (result[task.projectId] ?? 0) + 1;
      return result;
    }, {});
  }, [tasks]);

  const metrics = useMemo(() => {
    const activeProjects = projects.filter((project) => project.status !== 'Completed').length;
    const teamMembers = projects.reduce((sum, project) => sum + project.team, 0);
    const averageProgress = Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length);
    const openTasks = tasks.filter((task) => task.status !== 'completed').length;

    return [
      { label: projectText.metrics.activeProjects, value: activeProjects, accent: 'green' as const, icon: CheckCircle2 },
      { label: projectText.metrics.teamMembers, value: teamMembers, accent: 'blue' as const, icon: Users },
      { label: projectText.metrics.openTasks, value: openTasks, accent: 'gray' as const, icon: Flag },
      { label: projectText.metrics.averageProgress, value: `${averageProgress}%`, accent: 'yellow' as const, icon: Clock },
    ];
  }, [projects, projectText.metrics.activeProjects, projectText.metrics.averageProgress, projectText.metrics.openTasks, projectText.metrics.teamMembers, tasks]);

  useEffect(() => {
    setStatusMessage(storedWorkspace.restored ? projectText.messages.restored : projectText.messages.ready);
  }, [projectText.messages.ready, projectText.messages.restored, storedWorkspace.restored]);

  useEffect(() => {
    saveStoredJson(projectWorkspaceStorageKey, {
      projects,
      selectedProjectId,
      tasks,
    });
  }, [projects, selectedProjectId, tasks]);

  const updateSelectedProject = (updates: Partial<ProjectOverview>) => {
    setProjects((currentProjects) => currentProjects.map((project) => (project.id === selectedProjectId ? { ...project, ...updates } : project)));
  };

  const selectProject = (id: number) => {
    setSelectedProjectId(id);
    setTaskFilter('all');
  };

  const cycleSelectedProjectStatus = () => {
    const nextStatus = getNextProjectStatus(selectedProject.status);

    updateSelectedProject({
      status: nextStatus,
      progress: nextStatus === 'Completed' ? 100 : selectedProject.progress,
    });
    setStatusMessage(projectText.messages.projectStatusMoved(getProjectDisplayText(language, selectedProject.name), projectStatusLabels[language][nextStatus]));
  };

  const addProject = () => {
    const name = newProjectName.trim();

    if (!name) {
      setStatusMessage(projectText.messages.createProjectFirst);
      return;
    }

    const nextProject: ProjectOverview = {
      id: Math.max(0, ...projects.map((project) => project.id)) + 1,
      name,
      status: 'Planning',
      progress: 0,
      team: Math.max(1, newProjectTeam),
      deadline: newProjectDeadline || '2026-07-01',
    };

    setProjects((currentProjects) => [...currentProjects, nextProject]);
    setSelectedProjectId(nextProject.id);
    setNewProjectName('');
    setStatusMessage(projectText.messages.projectCreated(getProjectDisplayText(language, nextProject.name)));
  };

  const deleteSelectedProject = () => {
    if (projects.length === 1) {
      setStatusMessage(projectText.messages.keepOneProject);
      return;
    }

    const nextProjects = projects.filter((project) => project.id !== selectedProject.id);
    setProjects(nextProjects);
    setTasks((currentTasks) => currentTasks.filter((task) => task.projectId !== selectedProject.id));
    setSelectedProjectId(nextProjects[0].id);
    setTaskFilter('all');
    setStatusMessage(projectText.messages.projectRemoved(getProjectDisplayText(language, selectedProject.name)));
  };

  const addTask = () => {
    const title = newTaskTitle.trim();
    const assignee = newTaskAssignee.trim();

    if (!title || !assignee) {
      setStatusMessage(projectText.messages.createTaskFirst);
      return;
    }

    setTasks((currentTasks) => [
      {
        id: Math.max(0, ...currentTasks.map((task) => task.id)) + 1,
        projectId: selectedProject.id,
        title,
        assignee,
        status: 'pending',
        priority: newTaskPriority,
        dueDate: selectedProject.deadline,
      },
      ...currentTasks,
    ]);
    setNewTaskTitle('');
    setTaskFilter('all');
    setStatusMessage(projectText.messages.taskAdded(getProjectDisplayText(language, title), getProjectDisplayText(language, selectedProject.name)));
  };

  const cycleTaskStatus = (id: number) => {
    setTasks((currentTasks) => currentTasks.map((task) => (task.id === id ? { ...task, status: getNextTaskStatus(task.status) } : task)));
    setStatusMessage(projectText.messages.taskUpdated);
  };

  const deleteTask = (id: number) => {
    const task = tasks.find((item) => item.id === id);
    setTasks((currentTasks) => currentTasks.filter((item) => item.id !== id));
    setStatusMessage(task ? projectText.messages.taskRemoved(getProjectDisplayText(language, task.title)) : projectText.messages.taskRemovedFallback);
  };

  const exportWorkspace = () => {
    downloadWorkspaceJson({
      exportedAt: new Date().toISOString(),
      projects,
      selectedProjectId,
      tasks,
    }, 'project-management-workspace.json');
    setStatusMessage(projectText.messages.workspaceReady);
  };

  const resetWorkspace = () => {
    setProjects(fallbackProjectWorkspace.projects);
    setTasks(fallbackProjectWorkspace.tasks);
    setSelectedProjectId(fallbackProjectWorkspace.selectedProjectId);
    setTaskFilter('all');
    removeStoredValue(projectWorkspaceStorageKey);
    setStatusMessage(projectText.messages.projectReset);
  };

  return {
    addProject,
    addTask,
    cycleSelectedProjectStatus,
    cycleTaskStatus,
    deleteSelectedProject,
    deleteTask,
    exportWorkspace,
    language,
    metrics,
    newProjectDeadline,
    newProjectName,
    newProjectTeam,
    newTaskAssignee,
    newTaskPriority,
    newTaskTitle,
    projectText,
    projects,
    resetWorkspace,
    selectProject,
    selectedProject,
    selectedProjectId,
    selectedProjectTasks,
    setNewProjectDeadline,
    setNewProjectName,
    setNewProjectTeam,
    setNewTaskAssignee,
    setNewTaskPriority,
    setNewTaskTitle,
    setTaskFilter,
    statusMessage,
    taskCountsByProject,
    taskFilter,
    updateSelectedProject,
    visibleTasks,
  };
}
