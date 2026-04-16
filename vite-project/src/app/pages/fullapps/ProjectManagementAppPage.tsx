import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { ProjectBoard } from '@/app/components/showcase/ProjectBoard';
import { TaskFeed } from '@/app/components/showcase/TaskFeed';
import { projectManagementMetrics, projectManagementProjects, projectManagementTasks } from '@/app/data/showcase';

/**
 * Project dashboard page assembled from reusable dashboard sections.
 * Splitting metrics, project cards, and task feed keeps the page focused on composition.
 */
export function ProjectManagementAppPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <PageIntro
        highlight="Project Management"
        title="App"
        description="Manage projects, track progress, and collaborate with your team"
      />

      <MetricGrid items={projectManagementMetrics} columnsClassName="grid-cols-1 sm:grid-cols-3" />
      <ProjectBoard title="Active Projects" items={projectManagementProjects} />
      <TaskFeed title="Recent Tasks" items={projectManagementTasks} />
    </div>
  );
}
