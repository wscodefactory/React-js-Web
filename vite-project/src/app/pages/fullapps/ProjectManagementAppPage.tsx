import { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Plus, Users } from 'lucide-react';
import { Button, Card, CardContent, FormField, Input } from '@/app/components/common';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { projectManagementProjects, projectManagementTasks } from '@/app/data/showcase';
import { taskStatusIconMap } from '@/app/data/showcase';
import type { ProjectOverview, TaskItem } from '@/app/types/showcase';

const projectStatusClassMap: Record<ProjectOverview['status'], string> = {
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Planning: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

const taskStatusClassMap: Record<TaskItem['status'], string> = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

function nextProjectStatus(status: ProjectOverview['status']): ProjectOverview['status'] {
  if (status === 'Planning') return 'In Progress';
  if (status === 'In Progress') return 'Completed';
  return 'Planning';
}

function nextTaskStatus(status: TaskItem['status']): TaskItem['status'] {
  if (status === 'pending') return 'in-progress';
  if (status === 'in-progress') return 'completed';
  return 'pending';
}

export function ProjectManagementAppPage() {
  const [projects, setProjects] = useState<ProjectOverview[]>(projectManagementProjects);
  const [tasks, setTasks] = useState<TaskItem[]>(projectManagementTasks);
  const [selectedProjectId, setSelectedProjectId] = useState(projectManagementProjects[0].id);
  const [newTaskTitle, setNewTaskTitle] = useState('Prepare stakeholder update');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Mina');
  const [statusMessage, setStatusMessage] = useState('Select a project to edit progress and task flow.');

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];

  const metrics = useMemo(() => {
    const activeProjects = projects.filter((project) => project.status !== 'Completed').length;
    const teamMembers = projects.reduce((sum, project) => sum + project.team, 0);
    const averageProgress = Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length);

    return [
      { label: 'Active Projects', value: activeProjects, accent: 'green' as const, icon: CheckCircle2 },
      { label: 'Team Members', value: teamMembers, accent: 'blue' as const, icon: Users },
      { label: 'Avg. Progress', value: `${averageProgress}%`, accent: 'yellow' as const, icon: Clock },
    ];
  }, [projects]);

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
        title,
        assignee,
        status: 'pending',
      },
      ...current,
    ]);
    setNewTaskTitle('');
    setStatusMessage(`${title} was added to the task queue.`);
  };

  const cycleTask = (id: number) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status: nextTaskStatus(task.status) } : task)));
    setStatusMessage('Task status updated.');
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight="Project Management"
        title="App"
        description="Manage projects, track progress, and collaborate with your team"
      />

      <MetricGrid items={metrics} columnsClassName="grid-cols-1 sm:grid-cols-3" />

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <ProjectWorkspace
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />

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
                    onChange={(event) => updateSelectedProject({ progress: Number(event.target.value) })}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-green-600 dark:bg-gray-700"
                  />
                  <span className="w-12 text-right text-sm font-medium text-gray-700 dark:text-gray-300">{selectedProject.progress}%</span>
                </div>
              </FormField>

              <Button variant="secondary" onClick={cycleProject} className="mt-4 w-full justify-center">
                Advance Status
              </Button>
            </div>

            <div className="space-y-3">
              <FormField label="Task Title">
                <Input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="Task title" />
              </FormField>
              <FormField label="Assignee">
                <Input value={newTaskAssignee} onChange={(event) => setNewTaskAssignee(event.target.value)} placeholder="Assignee" />
              </FormField>
              <Button onClick={addTask} className="w-full justify-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>

            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{statusMessage}</p>
          </CardContent>
        </Card>
      </section>

      <TaskQueue items={tasks} onCycleTask={cycleTask} />
    </div>
  );
}

function ProjectWorkspace({
  projects,
  selectedProjectId,
  onSelectProject,
}: {
  projects: ProjectOverview[];
  selectedProjectId: number;
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

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {project.team} members
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {project.deadline}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function TaskQueue({ items, onCycleTask }: { items: TaskItem[]; onCycleTask: (id: number) => void }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Queue</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click a task action to move it through pending, in-progress, and completed.</p>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((task) => {
          const StatusIcon = taskStatusIconMap[task.status];
          const iconClassName = task.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600';
          return (
            <article key={task.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
              <StatusIcon className={`h-5 w-5 ${iconClassName}`} />
              <div className="flex-1">
                <h3 className={task.status === 'completed' ? 'font-medium text-gray-500 line-through dark:text-gray-500' : 'font-medium text-gray-900 dark:text-white'}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to {task.assignee}</p>
              </div>
              <span className={`w-fit rounded-full px-3 py-1 text-xs ${taskStatusClassMap[task.status]}`}>{task.status.replace('-', ' ')}</span>
              <Button variant="secondary" onClick={() => onCycleTask(task.id)} className="justify-center">
                Move Status
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
