import { taskStatusIconMap } from '@/app/data/showcase';
import type { TaskItem } from '@/app/types/showcase';

interface TaskFeedProps {
  title: string;
  items: TaskItem[];
}

const statusClassMap: Record<TaskItem['status'], string> = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
};

export function TaskFeed({ title, items }: TaskFeedProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((task) => {
          const StatusIcon = taskStatusIconMap[task.status];
          const iconClassName = task.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600';
          return (
            <article key={task.id} className="flex items-center gap-4 p-6">
              <StatusIcon className={`h-5 w-5 ${iconClassName}`} />
              <div className="flex-1">
                <h3
                  className={
                    task.status === 'completed'
                      ? 'font-medium text-gray-500 line-through dark:text-gray-500'
                      : 'font-medium text-gray-900 dark:text-white'
                  }
                >
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to {task.assignee}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${statusClassMap[task.status]}`}>{task.status.replace('-', ' ')}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
