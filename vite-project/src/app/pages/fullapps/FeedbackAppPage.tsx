import { FeedbackFeed } from '@/app/components/showcase/FeedbackFeed';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { feedbackEntries, feedbackMetrics } from '@/app/data/showcase';

/**
 * Feedback dashboard page that now relies on shared data and feed components.
 * This reduces inline markup repetition and makes the UI easier to evolve.
 */
export function FeedbackAppPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <PageIntro
        highlight="Feedback"
        title="App"
        description="Collect, manage, and analyze customer feedback with ease"
      />

      <MetricGrid items={feedbackMetrics} columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
      <FeedbackFeed title="Recent Feedback" items={feedbackEntries} />
    </div>
  );
}
