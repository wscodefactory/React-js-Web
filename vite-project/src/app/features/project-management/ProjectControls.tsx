import { Download, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, FormField, Input } from '../../components/common';
import type { AppLanguage } from '../../context/LanguageContext';
import type { ProjectOverview } from '../../types/showcase';
import { getProjectDisplayText, projectStatusLabels, taskPriorityLabels } from './copy';
import { projectStatusClassMap, taskPriorities } from './constants';
import { getProjectTaskProgress } from './workspaceUtils';
import type { ProjectManagementText, ProjectTask, TaskPriority } from './types';

type ProjectControlsProps = {
  language: AppLanguage;
  newProjectDeadline: string;
  newProjectName: string;
  newProjectTeam: number;
  newTaskAssignee: string;
  newTaskPriority: TaskPriority;
  newTaskTitle: string;
  projectTasks: ProjectTask[];
  selectedProject: ProjectOverview;
  statusMessage: string;
  text: ProjectManagementText;
  onAddProject: () => void;
  onAddTask: () => void;
  onCycleProject: () => void;
  onDeleteProject: () => void;
  onExportWorkspace: () => void;
  onNewProjectDeadlineChange: (value: string) => void;
  onNewProjectNameChange: (value: string) => void;
  onNewProjectTeamChange: (value: number) => void;
  onNewTaskAssigneeChange: (value: string) => void;
  onNewTaskPriorityChange: (value: TaskPriority) => void;
  onNewTaskTitleChange: (value: string) => void;
  onProgressChange: (value: number) => void;
  onResetWorkspace: () => void;
};

export function ProjectControls({
  language,
  newProjectDeadline,
  newProjectName,
  newProjectTeam,
  newTaskAssignee,
  newTaskPriority,
  newTaskTitle,
  projectTasks,
  selectedProject,
  statusMessage,
  text,
  onAddProject,
  onAddTask,
  onCycleProject,
  onDeleteProject,
  onExportWorkspace,
  onNewProjectDeadlineChange,
  onNewProjectNameChange,
  onNewProjectTeamChange,
  onNewTaskAssigneeChange,
  onNewTaskPriorityChange,
  onNewTaskTitleChange,
  onProgressChange,
  onResetWorkspace,
}: ProjectControlsProps) {
  const taskProgress = getProjectTaskProgress(projectTasks);
  const selectedProjectName = getProjectDisplayText(language, selectedProject.name);

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardContent className="min-w-0 space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{text.controlsTitle}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{text.controlsDescription}</p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{text.selected}</p>
              <h3 className="font-semibold text-gray-900 dark:text-white">{selectedProjectName}</h3>
            </div>
            <span className={`shrink-0 whitespace-nowrap rounded px-2 py-1 text-xs ${projectStatusClassMap[selectedProject.status]}`}>{projectStatusLabels[language][selectedProject.status]}</span>
          </div>

          <FormField label={text.progress}>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={selectedProject.progress}
                onChange={(event) => onProgressChange(Number(event.target.value))}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-green-600 dark:bg-gray-700"
              />
              <span className="w-12 text-right text-sm font-medium text-gray-700 dark:text-gray-300">{selectedProject.progress}%</span>
            </div>
          </FormField>

          <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">
            {text.taskCompletion(taskProgress, projectTasks.length)}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Button variant="secondary" onClick={onCycleProject} className="justify-center">
              {text.statusAdvance}
            </Button>
            <Button variant="secondary" onClick={onDeleteProject} className="justify-center text-red-600 dark:text-red-300">
              <Trash2 className="h-4 w-4" />
              {text.delete}
            </Button>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" onClick={onExportWorkspace} className="justify-center gap-2">
            <Download className="h-4 w-4" />
            {text.exportWorkspace}
          </Button>
          <Button variant="secondary" onClick={onResetWorkspace} className="justify-center gap-2">
            <RotateCcw className="h-4 w-4" />
            {text.resetWorkspace}
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">{text.addTaskTitle}</h3>
          <FormField label={text.taskTitle}>
            <Input value={newTaskTitle} onChange={(event) => onNewTaskTitleChange(event.target.value)} placeholder={text.taskTitlePlaceholder} />
          </FormField>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label={text.assignee}>
              <Input value={newTaskAssignee} onChange={(event) => onNewTaskAssigneeChange(event.target.value)} placeholder={text.assigneePlaceholder} />
            </FormField>
            <FormField label={text.priority}>
              <select
                value={newTaskPriority}
                onChange={(event) => onNewTaskPriorityChange(event.target.value as TaskPriority)}
                className="form-input"
              >
                {taskPriorities.map((priority) => (
                  <option key={priority} value={priority}>{taskPriorityLabels[language][priority]}</option>
                ))}
              </select>
            </FormField>
          </div>
          <Button onClick={onAddTask} className="w-full justify-center gap-2">
            <Plus className="h-4 w-4" />
            {text.addTask}
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">{text.addProjectTitle}</h3>
          <FormField label={text.projectName}>
            <Input value={newProjectName} onChange={(event) => onNewProjectNameChange(event.target.value)} placeholder={text.projectNamePlaceholder} />
          </FormField>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label={text.team}>
              <Input type="number" min={1} value={newProjectTeam} onChange={(event) => onNewProjectTeamChange(Number(event.target.value))} />
            </FormField>
            <FormField label={text.deadline}>
              <Input type="date" value={newProjectDeadline} onChange={(event) => onNewProjectDeadlineChange(event.target.value)} />
            </FormField>
          </div>
          <Button variant="secondary" onClick={onAddProject} className="w-full justify-center gap-2">
            <Plus className="h-4 w-4" />
            {text.addProject}
          </Button>
        </div>

        <p className="break-words rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 [overflow-wrap:anywhere] dark:bg-gray-900 dark:text-gray-400">{statusMessage}</p>
      </CardContent>
    </Card>
  );
}
