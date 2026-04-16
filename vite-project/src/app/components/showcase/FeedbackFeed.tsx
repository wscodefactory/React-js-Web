import { Star } from 'lucide-react';
import type { FeedbackEntry } from '@/app/types/showcase';

interface FeedbackFeedProps {
  title: string;
  items: FeedbackEntry[];
}

export function FeedbackFeed({ title, items }: FeedbackFeedProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((feedback) => (
          <article key={feedback.id} className="p-6">
            <div className="mb-2 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{feedback.user}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feedback.date}</p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={`${feedback.id}-${index}`}
                    className={`h-4 w-4 ${index < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{feedback.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
