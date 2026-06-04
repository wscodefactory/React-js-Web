import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock, Download, Filter, Flag, Plus, RotateCcw, Trash2, Users } from 'lucide-react';
import { Button, Card, CardContent, FormField, Input } from '@/app/components/common';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { projectManagementProjects, projectManagementTasks, taskStatusIconMap } from '@/app/data/showcase';
import type { ProjectOverview, TaskItem } from '@/app/types/showcase';

type ProjectStatus = ProjectOverview['status'];
type TaskStatus = TaskItem['status'];
type TaskPriority = 'High' | 'Medium' | 'Low';
type TaskFilter = 'all' | TaskStatus;
type ProjectTask = TaskItem & {
  projectId: number;
  priority: TaskPriority;
  dueDate: string;
};
type ProjectWorkspaceDraft = {
  projects: ProjectOverview[];
  selectedProjectId: number;
  tasks: ProjectTask[];
};

const projectWorkspaceStorageKey = 'web5:project-management-workspace:v1';
const projectStatuses: ProjectStatus[] = ['Planning', 'In Progress', 'Completed'];
const taskStatuses: TaskStatus[] = ['pending', 'in-progress', 'completed'];
const taskPriorities: TaskPriority[] = ['High', 'Medium', 'Low'];

const projectStatusClassMap: Record<ProjectStatus, string> = {
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Planning: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

const taskStatusClassMap: Record<TaskStatus, string> = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

const taskPriorityClassMap: Record<TaskPriority, string> = {
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const taskFilters: Array<{ id: TaskFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
];

const initialTasks: ProjectTask[] = projectManagementTasks.map((task, index) => ({
  ...task,
  projectId: projectManagementProjects[index % projectManagementProjects.length].id,
  priority: index % 3 === 0 ? 'High' : index % 2 === 0 ? 'Low' : 'Medium',
  dueDate: index % 2 === 0 ? '2026-05-24' : '2026-05-30',
}));

const fallbackWorkspace: ProjectWorkspaceDraft = {
  projects: projectManagementProjects,
  selectedProjectId: projectManagementProjects[0].id,
  tasks: initialTasks,
};

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

function readStoredWorkspace(): ProjectWorkspaceDraft {
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
      return fallbackWorkspace;
    }

    const selectedProjectId = parsed.projects.some((project) => project.id === parsed.selectedProjectId)
      ? Number(parsed.selectedProjectId)
      : parsed.projects[0].id;

    return {
      projects: parsed.projects,
      selectedProjectId,
      tasks: parsed.tasks.filter((task) => parsed.projects?.some((project) => project.id === task.projectId)),
    };
  } catch {
    return fallbackWorkspace;
  }
}

function downloadJson(content: unknown, fileName: string) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function nextProjectStatus(status: ProjectStatus): ProjectStatus {
  if (status === 'Planning') return 'In Progress';
  if (status === 'In Progress') return 'Completed';
  return 'Planning';
}

function nextTaskStatus(status: TaskStatus): TaskStatus {
  if (status === 'pending') return 'in-progress';
  if (status === 'in-progress') return 'completed';
  return 'pending';
}

function getProjectTaskProgress(tasks: ProjectTask[]) {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((task) => task.status === 'completed').length / tasks.length) * 100);
}

export function ProjectManagementAppPage() {
  const [storedWorkspace] = useState(() => readStoredWorkspace());
  const [projects, setProjects] = useState<ProjectOverview[]>(storedWorkspace.projects);
  const [tasks, setTasks] = useState<ProjectTask[]>(storedWorkspace.tasks);
  const [selectedProjectId, setSelectedProjectId] = useState(storedWorkspace.selectedProjectId);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('Prepare stakeholder update');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Mina');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newProjectName, setNewProjectName] = useState('Customer Portal');
  const [newProjectTeam, setNewProjectTeam] = useState(4);
  const [newProjectDeadline, setNewProjectDeadline] = useState('2026-06-30');
  const [statusMessage, setStatusMessage] = useState(storedWorkspace === fallbackWorkspace
    ? 'Select a project to edit progress and task flow.'
    : 'Project workspace restored from local storage.');

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];
  const selectedProjectTasks = tasks.filter((task) => task.projectId === selectedProject.id);
  const visibleTasks = selectedProjectTasks.filter((task) => taskFilter === 'all' || task.status === taskFilter);

  const metrics = useMemo(() => {
    const activeProjects = projects.filter((project) => project.status !== 'Completed').length;
    const teamMembers = projects.reduce((sum, project) => sum + project.team, 0);
    const averageProgress = Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length);
    const openTasks = tasks.filter((task) => task.status !== 'completed').length;

    return [
      { label: 'Active Projects', value: activeProjects, accent: 'green' as const, icon: CheckCircle2 },
      { label: 'Team Members', value: teamMembers, accent: 'blue' as const, icon: Users },
      { label: 'Open Tasks', value: openTasks, accent: 'gray' as const, icon: Flag },
      { label: 'Avg. Progress', value: `${averageProgress}%`, accent: 'yellow' as const, icon: Clock },
    ];
  }, [projects, tasks]);

  useEffect(() => {
    window.localStorage.setItem(projectWorkspaceStorageKey, JSON.stringify({
      projects,
      selectedProjectId,
      tasks,
    }));
  }, [projects, selectedProjectId, tasks]);

  const updateSelectedProject = (updates: Partial<ProjectOverview>) => {
    setProjects((current) => current.map((project) => (project.id === selectedProjectId ? { ...project, ...updates } : project)));
  };

  const cycleProject = () => {
    const nextStatus = nextProjectStatus(selectedProject.status);
    updateSelectedProject({
      status: nextStatus,
      progress: nextStatus === 'Completed' ? 100 : selectedProject.progress,
    });
    setStatusMessage(`${selectedProject.name} moved to ${nextStatus}.`);
  };

  const addProject = () => {
    const name = newProjectName.trim();

    if (!name) {
      setStatusMessage('Add a project name before creating a project.');
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

    setProjects((current) => [...current, nextProject]);
    setSelectedProjectId(nextProject.id);
    setNewProjectName('');
    setStatusMessage(`${nextProject.name} created and selected.`);
  };

  const deleteSelectedProject = () => {
    if (projects.length === 1) {
      setStatusMessage('Keep at least one project in the workspace.');
      return;
    }

    const nextProjects = projects.filter((project) => project.id !== selectedProject.id);
    setProjects(nextProjects);
    setTasks((current) => current.filter((task) => task.projectId !== selectedProject.id));
    setSelectedProjectId(nextProjects[0].id);
    setTaskFilter('all');
    setStatusMessage(`${selectedProject.name} and its tasks were removed.`);
  };

  const addTask = () => {
    const title = newTaskTitle.trim();
    const assignee = newTaskAssignee.trim();

    if (!title || !assignee) {
      setStatusMessage('Add a task title and assignee before creating a task.');
      return;
    }

    setTasks((current) => [
      {
        id: Math.max(0, ...current.map((task) => task.id)) + 1,
        projectId: selectedProject.id,
        title,
        assignee,
        status: 'pending',
        priority: newTaskPriority,
        dueDate: selectedProject.deadline,
      },
      ...current,
    ]);
    setNewTaskTitle('');
    setTaskFilter('all');
    setStatusMessage(`${title} was added to ${selectedProject.name}.`);
  };

  const cycleTask = (id: number) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status: nextTaskStatus(task.status) } : task)));
    setStatusMessage('Task status updated.');
  };

  const deleteTask = (id: number) => {
    const task = tasks.find((item) => item.id === id);
    setTasks((current) => current.filter((item) => item.id !== id));
    setStatusMessage(task ? `${task.title} removed from the queue.` : 'Task removed.');
  };

  const exportWorkspace = () => {
    downloadJson({
      exportedAt: new Date().toISOString(),
      projects,
      selectedProjectId,
      tasks,
    }, 'project-management-workspace.json');
    setStatusMessage('Project workspace queued for download.');
  };

  const resetWorkspace = () => {
    setProjects(fallbackWorkspace.projects);
    setTasks(fallbackWorkspace.tasks);
    setSelectedProjectId(fallbackWorkspace.selectedProjectId);
    setTaskFilter('all');
    window.localStorage.removeItem(projectWorkspaceStorageKey);
    setStatusMessage('Project workspace reset to the starter data.');
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight="Project Management"
        title="App"
        description="Manage projects, track progress, and collaborate with your team"
      />

      <MetricGrid items={metrics} columnsClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" />

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <ProjectWorkspace
          projects={projects}
          selectedProjectId={selectedProjectId}
          taskCountsByProject={tasks.reduce<Record<number, number>>((result, task) => {
            result[task.projectId] = (result[task.projectId] ?? 0) + 1;
            return result;
          }, {})}
          onSelectProject={(id) => {
            setSelectedProjectId(id);
            setTaskFilter('all');
          }}
        />

        <ProjectControls
          newProjectDeadline={newProjectDeadline}
          newProjectName={newProjectName}
          newProjectTeam={newProjectTeam}
          newTaskAssignee={newTaskAssignee}
          newTaskPriority={newTaskPriority}
          newTaskTitle={newTaskTitle}
          onAddProject={addProject}
          onAddTask={addTask}
          onCycleProject={cycleProject}
          onDeleteProject={deleteSelectedProject}
          onExportWorkspace={exportWorkspace}
          onNewProjectDeadlineChange={setNewProjectDeadline}
          onNewProjectNameChange={setNewProjectName}
          onNewProjectTeamChange={setNewProjectTeam}
          onNewTaskAssigneeChange={setNewTaskAssignee}
          onNewTaskPriorityChange={setNewTaskPriority}
          onNewTaskTitleChange={setNewTaskTitle}
          onProgressChange={(progress) => updateSelectedProject({ progress })}
          onResetWorkspace={resetWorkspace}
          projectTasks={selectedProjectTasks}
          selectedProject={selectedProject}
          statusMessage={statusMessage}
        />
      </section>

      <TaskQueue
        filter={taskFilter}
        items={visibleTasks}
        onCycleTask={cycleTask}
        onDeleteTask={deleteTask}
        onFilterChange={setTaskFilter}
        projectName={selectedProject.name}
        totalCount={selectedProjectTasks.length}
      />
    </div>
  );
}

function ProjectWorkspace({
  projects,
  selectedProjectId,
  taskCountsByProject,
  onSelectProject,
}: {
  projects: ProjectOverview[];
  selectedProjectId: number;
  taskCountsByProject: Record<number, number>;
  onSelectProject: (id: number) => void;
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Active Projects</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelectProject(project.id)}
            className={`rounded-lg border bg-white p-6 text-left transition dark:bg-gray-800 ${
              selectedProjectId === project.id
                ? 'border-green-500 shadow-sm'
                : 'border-gray-200 hover:border-green-300 dark:border-gray-700'
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
              <span className={`rounded px-2 py-1 text-xs ${projectStatusClassMap[project.status]}`}>{project.status}</span>
            </div>

            <div className="mb-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-semibold text-gray-900 dark:text-white">{project.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2 rounded-full bg-green-600 transition-all dark:bg-green-500" style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {project.team} members
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {project.deadline}
              </span>
              <span className="flex items-center gap-1">
                <Flag className="h-4 w-4" />
                {taskCountsByProject[project.id] ?? 0} tasks
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProjectControls({
  newProjectDeadline,
  newProjectName,
  newProjectTeam,
  newTaskAssignee,
  newTaskPriority,
  newTaskTitle,
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
  projectTasks,
  selectedProject,
  statusMessage,
}: {
  newProjectDeadline: string;
  newProjectName: string;
  newProjectTeam: number;
  newTaskAssignee: string;
  newTaskPriority: TaskPriority;
  newTaskTitle: string;
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
  projectTasks: ProjectTask[];
  selectedProject: ProjectOverview;
  statusMessage: string;
}) {
  const taskProgress = getProjectTaskProgress(projectTasks);

  return (
    <Card>
      <CardContent className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project Controls</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update the selected project without leaving the dashboard.</p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Selected</p>
              <h3 className="font-semibold text-gray-900 dark:text-white">{selectedProject.name}</h3>
            </div>
            <span className={`rounded px-2 py-1 text-xs ${projectStatusClassMap[selectedProject.status]}`}>{selectedProject.status}</span>
          </div>

          <FormField label="Progress">
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
            Task completion: {taskProgress}% across {projectTasks.length} tasks
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Button variant="secondary" onClick={onCycleProject} className="justify-center">
              Advance Status
            </Button>
            <Button variant="secondary" onClick={onDeleteProject} className="justify-center text-red-600 dark:text-red-300">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" onClick={onExportWorkspace} className="justify-center gap-2">
            <Download className="h-4 w-4" />
            Export Workspace
          </Button>
          <Button variant="secondary" onClick={onResetWorkspace} className="justify-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Workspace
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Add task to selected project</h3>
          <FormField label="Task Title">
            <Input value={newTaskTitle} onChange={(event) => onNewTaskTitleChange(event.target.value)} placeholder="Task title" />
          </FormField>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Assignee">
              <Input value={newTaskAssignee} onChange={(event) => onNewTaskAssigneeChange(event.target.value)} placeholder="Assignee" />
            </FormField>
            <FormField label="Priority">
              <select
                value={newTaskPriority}
                onChange={(event) => onNewTaskPriorityChange(event.target.value as TaskPriority)}
                className="form-input"
              >
                {(['High', 'Medium', 'Low'] as TaskPriority[]).map((priority) => (
                  <option key={priority}>{priority}</option>
                ))}
              </select>
            </FormField>
          </div>
          <Button onClick={onAddTask} className="w-full justify-center gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Create project</h3>
          <FormField label="Project Name">
            <Input value={newProjectName} onChange={(event) => onNewProjectNameChange(event.target.value)} placeholder="Project name" />
          </FormField>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Team">
              <Input type="number" min={1} value={newProjectTeam} onChange={(event) => onNewProjectTeamChange(Number(event.target.value))} />
            </FormField>
            <FormField label="Deadline">
              <Input type="date" value={newProjectDeadline} onChange={(event) => onNewProjectDeadlineChange(event.target.value)} />
            </FormField>
          </div>
          <Button variant="secondary" onClick={onAddProject} className="w-full justify-center gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>

        <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{statusMessage}</p>
      </CardContent>
    </Card>
  );
}

function TaskQueue({
  filter,
  items,
  onCycleTask,
  onDeleteTask,
  onFilterChange,
  projectName,
  totalCount,
}: {
  filter: TaskFilter;
  items: ProjectTask[];
  onCycleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onFilterChange: (value: TaskFilter) => void;
  projectName: string;
  totalCount: number;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-6 dark:border-gray-700 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Queue</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {projectName} has {totalCount} tasks. Click a task action to move it through pending, in-progress, and completed.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {taskFilters.map((taskFilter) => (
            <button
              key={taskFilter.id}
              type="button"
              onClick={() => onFilterChange(taskFilter.id)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                filter === taskFilter.id
                  ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {taskFilter.label}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.length > 0 ? (
          items.map((task) => {
            const StatusIcon = taskStatusIconMap[task.status];
            const iconClassName = task.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600';

            return (
              <article key={task.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
                <StatusIcon className={`h-5 w-5 ${iconClassName}`} />
                <div className="flex-1">
                  <h3 className={task.status === 'completed' ? 'font-medium text-gray-500 line-through dark:text-gray-500' : 'font-medium text-gray-900 dark:text-white'}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to {task.assignee} / due {task.dueDate}</p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs ${taskPriorityClassMap[task.priority]}`}>{task.priority}</span>
                <span className={`w-fit rounded-full px-3 py-1 text-xs ${taskStatusClassMap[task.status]}`}>{task.status.replace('-', ' ')}</span>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => onCycleTask(task.id)} className="justify-center">
                    Move Status
                  </Button>
                  <Button variant="secondary" onClick={() => onDeleteTask(task.id)} aria-label={`Delete ${task.title}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No tasks match this filter.
          </div>
        )}
      </div>
    </section>
  );
}
