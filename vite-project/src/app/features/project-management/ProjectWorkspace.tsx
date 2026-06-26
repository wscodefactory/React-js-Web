import { CalendarDays, Flag, Users } from 'lucide-react';
import type { AppLanguage } from '../../context/LanguageContext';
import type { ProjectOverview } from '../../types/showcase';
import { getProjectDisplayText, projectStatusLabels } from './copy';
import { projectStatusClassMap } from './constants';
import type { ProjectManagementText } from './types';

type ProjectWorkspaceProps = {
  language: AppLanguage;
  projects: ProjectOverview[];
  selectedProjectId: number;
  taskCountsByProject: Record<number, number>;
  text: ProjectManagementText;
  onSelectProject: (id: number) => void;
};

export function ProjectWorkspace({
  language,
  projects,
  selectedProjectId,
  taskCountsByProject,
  text,
  onSelectProject,
}: ProjectWorkspaceProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{text.activeProjects}</h2>
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
              <h3 className="font-semibold text-gray-900 dark:text-white">{getProjectDisplayText(language, project.name)}</h3>
              <span className={`shrink-0 whitespace-nowrap rounded px-2 py-1 text-xs ${projectStatusClassMap[project.status]}`}>{projectStatusLabels[language][project.status]}</span>
            </div>

            <div className="mb-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{text.progress}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{project.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2 rounded-full bg-green-600 transition-all dark:bg-green-500" style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {text.teamMembers(project.team)}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {project.deadline}
              </span>
              <span className="flex items-center gap-1">
                <Flag className="h-4 w-4" />
                {text.taskCount(taskCountsByProject[project.id] ?? 0)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
