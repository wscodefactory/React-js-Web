import { useMemo, useState } from 'react';
import { CheckCircle2, MessageSquare, Plus, Star, TrendingUp, Users } from 'lucide-react';
import { Button, Card, CardContent, FormField, Input } from '@/app/components/common';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { feedbackEntries } from '@/app/data/showcase';
import type { FeedbackEntry } from '@/app/types/showcase';

type FeedbackStatus = 'new' | 'reviewed';
type RatingFilter = 'all' | 'high' | 'needs-review';
type FeedbackRecord = FeedbackEntry & { status: FeedbackStatus };

const initialFeedback: FeedbackRecord[] = feedbackEntries.map((entry, index) => ({
  ...entry,
  status: index === 0 ? 'new' : 'reviewed',
}));

const ratingFilters: Array<{ id: RatingFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'high', label: '4+ stars' },
  { id: 'needs-review', label: 'Needs review' },
];

export function FeedbackAppPage() {
  const [items, setItems] = useState<FeedbackRecord[]>(initialFeedback);
  const [filter, setFilter] = useState<RatingFilter>('all');
  const [draftUser, setDraftUser] = useState('New customer');
  const [draftComment, setDraftComment] = useState('Fast response and clear handoff.');
  const [draftRating, setDraftRating] = useState(5);
  const [statusMessage, setStatusMessage] = useState('Ready to collect the next feedback item.');

  const visibleItems = useMemo(() => {
    if (filter === 'high') {
      return items.filter((item) => item.rating >= 4);
    }
    if (filter === 'needs-review') {
      return items.filter((item) => item.status === 'new' || item.rating <= 3);
    }
    return items;
  }, [filter, items]);

  const metrics = useMemo(() => {
    const average = items.length ? items.reduce((sum, item) => sum + item.rating, 0) / items.length : 0;
    const reviewedCount = items.filter((item) => item.status === 'reviewed').length;
    const growth = items.length > feedbackEntries.length ? `+${items.length - feedbackEntries.length}` : '+0';

    return [
      { label: 'Total Feedback', value: items.length, accent: 'green' as const, icon: MessageSquare },
      { label: 'Avg Rating', value: average.toFixed(1), accent: 'yellow' as const, icon: Star },
      { label: 'Reviewed', value: reviewedCount, accent: 'blue' as const, icon: CheckCircle2 },
      { label: 'New This Session', value: growth, accent: 'gray' as const, icon: TrendingUp },
    ];
  }, [items]);

  const addFeedback = () => {
    const user = draftUser.trim();
    const comment = draftComment.trim();
    if (!user || !comment) {
      setStatusMessage('Add a user and comment before saving feedback.');
      return;
    }

    const nextItem: FeedbackRecord = {
      id: Math.max(0, ...items.map((item) => item.id)) + 1,
      user,
      comment,
      rating: draftRating,
      date: new Date().toISOString().slice(0, 10),
      status: 'new',
    };

    setItems((current) => [nextItem, ...current]);
    setDraftComment('');
    setStatusMessage(`${user}'s feedback was added and marked for review.`);
  };

  const markReviewed = (id: number) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status: 'reviewed' } : item)));
    setStatusMessage('Feedback marked as reviewed.');
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight="Feedback"
        title="App"
        description="Collect, manage, and analyze customer feedback with ease"
      />

      <MetricGrid items={metrics} columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Capture Feedback</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a new response and route it into the review queue.</p>
            </div>

            <FormField label="Customer">
              <Input value={draftUser} onChange={(event) => setDraftUser(event.target.value)} placeholder="Customer name" />
            </FormField>

            <FormField label="Comment">
              <textarea
                value={draftComment}
                onChange={(event) => setDraftComment(event.target.value)}
                placeholder="Write the feedback summary"
                className="form-input min-h-28 resize-none"
              />
            </FormField>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating</p>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }, (_, index) => {
                  const rating = index + 1;
                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setDraftRating(rating)}
                      className={`flex h-10 items-center justify-center rounded-lg border ${
                        rating <= draftRating
                          ? 'border-yellow-400 bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20'
                          : 'border-gray-200 text-gray-300 dark:border-gray-700 dark:text-gray-600'
                      }`}
                      aria-label={`${rating} star rating`}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={addFeedback} className="w-full justify-center gap-2">
              <Plus className="h-4 w-4" />
              Add Feedback
            </Button>
            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{statusMessage}</p>
          </CardContent>
        </Card>

        <FeedbackInbox
          items={visibleItems}
          activeFilter={filter}
          onFilterChange={setFilter}
          onMarkReviewed={markReviewed}
        />
      </section>
    </div>
  );
}

function FeedbackInbox({
  items,
  activeFilter,
  onFilterChange,
  onMarkReviewed,
}: {
  items: FeedbackRecord[];
  activeFilter: RatingFilter;
  onFilterChange: (value: RatingFilter) => void;
  onMarkReviewed: (id: number) => void;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-6 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Feedback Inbox</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Filter, review, and resolve incoming feedback.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ratingFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onFilterChange(item.id)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                activeFilter === item.id
                  ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((feedback) => (
          <article key={feedback.id} className="p-6">
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{feedback.user}</h3>
                  <span className={`rounded-full px-2 py-1 text-xs ${feedback.status === 'new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                    {feedback.status}
                  </span>
                </div>
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
            {feedback.status === 'new' ? (
              <Button variant="secondary" onClick={() => onMarkReviewed(feedback.id)} className="mt-4 gap-2">
                <Users className="h-4 w-4" />
                Mark Reviewed
              </Button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
