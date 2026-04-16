import { Clock, Users } from 'lucide-react';
import type { ProjectOverview } from '@/app/types/showcase';

interface ProjectBoardProps {
  title: string;
  items: ProjectOverview[];
}

const statusClassMap: Record<ProjectOverview['status'], string> = {
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Planning: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

export function ProjectBoard({ title, items }: ProjectBoardProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {items.map((project) => (
          <article key={project.id} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
              <span className={`rounded px-2 py-1 text-xs ${statusClassMap[project.status]}`}>{project.status}</span>
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
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{project.team} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{project.deadline}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
