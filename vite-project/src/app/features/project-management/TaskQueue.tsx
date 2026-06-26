import { Filter, Trash2 } from 'lucide-react';
import { Button } from '../../components/common';
import type { AppLanguage } from '../../context/LanguageContext';
import { taskStatusIconMap } from '../../data/showcase';
import { getProjectDisplayText, taskFilterLabels, taskPriorityLabels, taskStatusLabels } from './copy';
import { taskFilters, taskPriorityClassMap, taskStatusClassMap } from './constants';
import type { ProjectManagementText, ProjectTask, TaskFilter } from './types';

type TaskQueueProps = {
  filter: TaskFilter;
  items: ProjectTask[];
  language: AppLanguage;
  projectName: string;
  text: ProjectManagementText;
  totalCount: number;
  onCycleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onFilterChange: (value: TaskFilter) => void;
};

export function TaskQueue({
  filter,
  items,
  language,
  projectName,
  text,
  totalCount,
  onCycleTask,
  onDeleteTask,
  onFilterChange,
}: TaskQueueProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-6 dark:border-gray-700 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{text.taskQueueTitle}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {text.taskQueueDescription(projectName, totalCount)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {taskFilters.map((taskFilter) => (
            <button
              key={taskFilter}
              type="button"
              onClick={() => onFilterChange(taskFilter)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                filter === taskFilter
                  ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {taskFilterLabels[language][taskFilter]}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.length > 0 ? (
          items.map((task) => {
            const StatusIcon = taskStatusIconMap[task.status];
            const iconClassName = task.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600';
            const displayAssignee = getProjectDisplayText(language, task.assignee);
            const displayTitle = getProjectDisplayText(language, task.title);

            return (
              <article key={task.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
                <StatusIcon className={`h-5 w-5 ${iconClassName}`} />
                <div className="flex-1">
                  <h3 className={task.status === 'completed' ? 'font-medium text-gray-500 line-through dark:text-gray-500' : 'font-medium text-gray-900 dark:text-white'}>
                    {displayTitle}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'ko' ? `${displayAssignee} 담당 / ${task.dueDate} 마감` : `Assigned to ${displayAssignee} / due ${task.dueDate}`}
                  </p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs ${taskPriorityClassMap[task.priority]}`}>{taskPriorityLabels[language][task.priority]}</span>
                <span className={`w-fit rounded-full px-3 py-1 text-xs ${taskStatusClassMap[task.status]}`}>{taskStatusLabels[language][task.status]}</span>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => onCycleTask(task.id)} className="justify-center">
                    {text.moveStatus}
                  </Button>
                  <Button variant="secondary" onClick={() => onDeleteTask(task.id)} aria-label={`${text.delete} ${displayTitle}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {text.noTasks}
          </div>
        )}
      </div>
    </section>
  );
}
