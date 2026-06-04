import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Download, Filter, MessageSquare, Plus, RotateCcw, Search, Send, Star, Trash2, TrendingUp, Users } from 'lucide-react';
import { Button, Card, CardContent, FormField, Input } from '@/app/components/common';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { feedbackEntries } from '@/app/data/showcase';
import type { FeedbackEntry } from '@/app/types/showcase';

type FeedbackStatus = 'new' | 'reviewed' | 'resolved';
type RatingFilter = 'all' | 'high' | 'needs-review' | 'resolved';
type FeedbackChannel = 'Web' | 'Email' | 'In-app';
type FeedbackRecord = FeedbackEntry & {
  channel: FeedbackChannel;
  response?: string;
  status: FeedbackStatus;
};
type FeedbackWorkspaceDraft = {
  draftChannel: FeedbackChannel;
  draftComment: string;
  draftRating: number;
  draftUser: string;
  items: FeedbackRecord[];
  responseDraft: string;
  selectedFeedbackId: number | null;
};

const initialFeedback: FeedbackRecord[] = feedbackEntries.map((entry, index) => ({
  ...entry,
  channel: index === 0 ? 'Web' : index === 1 ? 'Email' : 'In-app',
  status: index === 0 ? 'new' : 'reviewed',
}));

const feedbackWorkspaceStorageKey = 'web5:feedback-workspace:v1';
const feedbackStatuses: FeedbackStatus[] = ['new', 'reviewed', 'resolved'];
const feedbackChannels: FeedbackChannel[] = ['Web', 'Email', 'In-app'];
const fallbackFeedbackWorkspace: FeedbackWorkspaceDraft = {
  draftChannel: 'Web',
  draftComment: 'Fast response and clear handoff.',
  draftRating: 5,
  draftUser: 'New customer',
  items: initialFeedback,
  responseDraft: 'Thanks for the thoughtful feedback. We reviewed it with the team and will fold it into the next pass.',
  selectedFeedbackId: initialFeedback[0]?.id ?? null,
};

const ratingFilters: Array<{ id: RatingFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'high', label: '4+ stars' },
  { id: 'needs-review', label: 'Needs review' },
  { id: 'resolved', label: 'Resolved' },
];

const responseTemplates = [
  'Thanks for the thoughtful feedback. We reviewed it with the team and will fold it into the next pass.',
  'Thanks for reporting this. We marked it for follow-up and will keep the handoff notes updated.',
  'Glad to hear this worked well. We appreciate the time you took to share the detail.',
];

function isFeedbackRecord(value: unknown): value is FeedbackRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<FeedbackRecord>;
  return typeof candidate.id === 'number'
    && typeof candidate.user === 'string'
    && typeof candidate.comment === 'string'
    && typeof candidate.date === 'string'
    && typeof candidate.rating === 'number'
    && candidate.rating >= 1
    && candidate.rating <= 5
    && feedbackChannels.includes(candidate.channel as FeedbackChannel)
    && feedbackStatuses.includes(candidate.status as FeedbackStatus)
    && (candidate.response === undefined || typeof candidate.response === 'string');
}

function readStoredFeedbackWorkspace(): FeedbackWorkspaceDraft {
  if (typeof window === 'undefined') {
    return fallbackFeedbackWorkspace;
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(feedbackWorkspaceStorageKey) ?? 'null') as Partial<FeedbackWorkspaceDraft> | null;

    if (!parsed || !Array.isArray(parsed.items) || !parsed.items.every(isFeedbackRecord)) {
      return fallbackFeedbackWorkspace;
    }

    const selectedFeedbackId = parsed.items.some((item) => item.id === parsed.selectedFeedbackId)
      ? Number(parsed.selectedFeedbackId)
      : parsed.items[0]?.id ?? null;

    return {
      draftChannel: feedbackChannels.includes(parsed.draftChannel as FeedbackChannel) ? parsed.draftChannel as FeedbackChannel : fallbackFeedbackWorkspace.draftChannel,
      draftComment: typeof parsed.draftComment === 'string' ? parsed.draftComment : fallbackFeedbackWorkspace.draftComment,
      draftRating: typeof parsed.draftRating === 'number' && parsed.draftRating >= 1 && parsed.draftRating <= 5
        ? Math.round(parsed.draftRating)
        : fallbackFeedbackWorkspace.draftRating,
      draftUser: typeof parsed.draftUser === 'string' ? parsed.draftUser : fallbackFeedbackWorkspace.draftUser,
      items: parsed.items,
      responseDraft: typeof parsed.responseDraft === 'string' ? parsed.responseDraft : fallbackFeedbackWorkspace.responseDraft,
      selectedFeedbackId,
    };
  } catch {
    return fallbackFeedbackWorkspace;
  }
}

function downloadCsv(items: FeedbackRecord[]) {
  const rows = [
    ['User', 'Rating', 'Status', 'Channel', 'Date', 'Comment', 'Response'],
    ...items.map((item) => [
      item.user,
      String(item.rating),
      item.status,
      item.channel,
      item.date,
      item.comment,
      item.response ?? '',
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'feedback-export.csv';
  anchor.click();
  URL.revokeObjectURL(url);
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

export function FeedbackAppPage() {
  const [storedWorkspace] = useState(() => readStoredFeedbackWorkspace());
  const [items, setItems] = useState<FeedbackRecord[]>(storedWorkspace.items);
  const [filter, setFilter] = useState<RatingFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(storedWorkspace.selectedFeedbackId);
  const [responseDraft, setResponseDraft] = useState(storedWorkspace.responseDraft);
  const [draftUser, setDraftUser] = useState(storedWorkspace.draftUser);
  const [draftComment, setDraftComment] = useState(storedWorkspace.draftComment);
  const [draftChannel, setDraftChannel] = useState<FeedbackChannel>(storedWorkspace.draftChannel);
  const [draftRating, setDraftRating] = useState(storedWorkspace.draftRating);
  const [statusMessage, setStatusMessage] = useState(storedWorkspace === fallbackFeedbackWorkspace
    ? 'Ready to collect the next feedback item.'
    : 'Feedback workspace restored from local storage.');

  const selectedFeedback = items.find((item) => item.id === selectedFeedbackId) ?? null;

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesRating = filter === 'high'
        ? item.rating >= 4
        : filter === 'needs-review'
          ? item.status === 'new' || item.rating <= 3
          : filter === 'resolved'
            ? item.status === 'resolved'
            : true;
      const matchesQuery = !normalizedQuery || `${item.user} ${item.comment} ${item.channel} ${item.status}`.toLowerCase().includes(normalizedQuery);

      return matchesRating && matchesQuery;
    });
  }, [filter, items, query]);

  const metrics = useMemo(() => {
    const average = items.length ? items.reduce((sum, item) => sum + item.rating, 0) / items.length : 0;
    const reviewedCount = items.filter((item) => item.status !== 'new').length;
    const unresolvedCount = items.filter((item) => item.status !== 'resolved').length;
    const growth = items.length > feedbackEntries.length ? `+${items.length - feedbackEntries.length}` : '+0';

    return [
      { label: 'Total Feedback', value: items.length, accent: 'green' as const, icon: MessageSquare },
      { label: 'Avg Rating', value: average.toFixed(1), accent: 'yellow' as const, icon: Star },
      { label: 'Reviewed', value: reviewedCount, accent: 'blue' as const, icon: CheckCircle2 },
      { label: 'Open Items', value: unresolvedCount, accent: 'gray' as const, icon: TrendingUp },
      { label: 'New This Session', value: growth, accent: 'gray' as const, icon: Users },
    ];
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem(feedbackWorkspaceStorageKey, JSON.stringify({
      draftChannel,
      draftComment,
      draftRating,
      draftUser,
      items,
      responseDraft,
      selectedFeedbackId,
    }));
  }, [draftChannel, draftComment, draftRating, draftUser, items, responseDraft, selectedFeedbackId]);

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
      channel: draftChannel,
      comment,
      rating: draftRating,
      date: new Date().toISOString().slice(0, 10),
      status: 'new',
    };

    setItems((current) => [nextItem, ...current]);
    setSelectedFeedbackId(nextItem.id);
    setDraftComment('');
    setResponseDraft(responseTemplates[0]);
    setFilter('all');
    setStatusMessage(`${user}'s feedback was added and marked for review.`);
  };

  const markReviewed = (id: number) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status: item.status === 'resolved' ? 'resolved' : 'reviewed' } : item)));
    setSelectedFeedbackId(id);
    setStatusMessage('Feedback marked as reviewed.');
  };

  const resolveFeedback = () => {
    if (!selectedFeedback) {
      setStatusMessage('Select feedback before sending a response.');
      return;
    }

    const response = responseDraft.trim();

    if (!response) {
      setStatusMessage('Write a response before resolving feedback.');
      return;
    }

    setItems((current) => current.map((item) => (
      item.id === selectedFeedback.id ? { ...item, response, status: 'resolved' } : item
    )));
    setStatusMessage(`${selectedFeedback.user}'s feedback was resolved with a response.`);
  };

  const deleteFeedback = (id: number) => {
    const target = items.find((item) => item.id === id);
    const nextItems = items.filter((item) => item.id !== id);

    setItems(nextItems);
    setSelectedFeedbackId((current) => (current === id ? nextItems[0]?.id ?? null : current));
    setStatusMessage(target ? `${target.user}'s feedback was removed.` : 'Feedback removed.');
  };

  const exportWorkspace = () => {
    downloadJson({
      exportedAt: new Date().toISOString(),
      filter,
      items,
      query,
      selectedFeedbackId,
    }, 'feedback-workspace.json');
    setStatusMessage('Feedback workspace queued for download.');
  };

  const resetWorkspace = () => {
    setItems(fallbackFeedbackWorkspace.items);
    setFilter('all');
    setQuery('');
    setSelectedFeedbackId(fallbackFeedbackWorkspace.selectedFeedbackId);
    setResponseDraft(fallbackFeedbackWorkspace.responseDraft);
    setDraftUser(fallbackFeedbackWorkspace.draftUser);
    setDraftComment(fallbackFeedbackWorkspace.draftComment);
    setDraftChannel(fallbackFeedbackWorkspace.draftChannel);
    setDraftRating(fallbackFeedbackWorkspace.draftRating);
    window.localStorage.removeItem(feedbackWorkspaceStorageKey);
    setStatusMessage('Feedback workspace reset to the starter data.');
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight="Feedback"
        title="App"
        description="Collect, manage, and analyze customer feedback with ease"
      />

      <MetricGrid items={metrics} columnsClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-5" />

      <section className="grid gap-6 xl:grid-cols-[360px_1fr_360px]">
        <FeedbackCapturePanel
          draftChannel={draftChannel}
          draftComment={draftComment}
          draftRating={draftRating}
          draftUser={draftUser}
          onAddFeedback={addFeedback}
          onDraftChannelChange={setDraftChannel}
          onDraftCommentChange={setDraftComment}
          onDraftRatingChange={setDraftRating}
          onDraftUserChange={setDraftUser}
          statusMessage={statusMessage}
        />

        <FeedbackInbox
          activeFilter={filter}
          items={visibleItems}
          onDelete={deleteFeedback}
          onExportCsv={() => downloadCsv(visibleItems)}
          onExportJson={exportWorkspace}
          onFilterChange={setFilter}
          onMarkReviewed={markReviewed}
          onQueryChange={setQuery}
          onReset={resetWorkspace}
          onSelect={(feedback) => {
            setSelectedFeedbackId(feedback.id);
            setResponseDraft(feedback.response ?? responseTemplates[0]);
          }}
          query={query}
          selectedId={selectedFeedbackId}
        />

        <FeedbackResponsePanel
          feedback={selectedFeedback}
          onResolve={resolveFeedback}
          onTemplateSelect={setResponseDraft}
          onResponseChange={setResponseDraft}
          responseDraft={responseDraft}
        />
      </section>
    </div>
  );
}

function FeedbackCapturePanel({
  draftChannel,
  draftComment,
  draftRating,
  draftUser,
  onAddFeedback,
  onDraftChannelChange,
  onDraftCommentChange,
  onDraftRatingChange,
  onDraftUserChange,
  statusMessage,
}: {
  draftChannel: FeedbackChannel;
  draftComment: string;
  draftRating: number;
  draftUser: string;
  onAddFeedback: () => void;
  onDraftChannelChange: (value: FeedbackChannel) => void;
  onDraftCommentChange: (value: string) => void;
  onDraftRatingChange: (value: number) => void;
  onDraftUserChange: (value: string) => void;
  statusMessage: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Capture Feedback</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a new response and route it into the review queue.</p>
        </div>

        <FormField label="Customer">
          <Input value={draftUser} onChange={(event) => onDraftUserChange(event.target.value)} placeholder="Customer name" />
        </FormField>

        <FormField label="Channel">
          <select value={draftChannel} onChange={(event) => onDraftChannelChange(event.target.value as FeedbackChannel)} className="form-input">
            {(['Web', 'Email', 'In-app'] as FeedbackChannel[]).map((channel) => (
              <option key={channel}>{channel}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Comment">
          <textarea
            value={draftComment}
            onChange={(event) => onDraftCommentChange(event.target.value)}
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
                  onClick={() => onDraftRatingChange(rating)}
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

        <Button onClick={onAddFeedback} className="w-full justify-center gap-2">
          <Plus className="h-4 w-4" />
          Add Feedback
        </Button>
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{statusMessage}</p>
      </CardContent>
    </Card>
  );
}

function FeedbackInbox({
  activeFilter,
  items,
  onDelete,
  onExportCsv,
  onExportJson,
  onFilterChange,
  onMarkReviewed,
  onQueryChange,
  onReset,
  onSelect,
  query,
  selectedId,
}: {
  activeFilter: RatingFilter;
  items: FeedbackRecord[];
  onDelete: (id: number) => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onFilterChange: (value: RatingFilter) => void;
  onMarkReviewed: (id: number) => void;
  onQueryChange: (value: string) => void;
  onReset: () => void;
  onSelect: (feedback: FeedbackRecord) => void;
  query: string;
  selectedId: number | null;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-4 border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Feedback Inbox</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Filter, review, and resolve incoming feedback.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onExportCsv} className="w-fit gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="secondary" onClick={onExportJson} className="w-fit gap-2">
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="secondary" onClick={onReset} className="w-fit gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search feedback"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
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
        {items.length > 0 ? (
          items.map((feedback) => (
            <article key={feedback.id} className={`p-6 ${selectedId === feedback.id ? 'bg-green-50/60 dark:bg-green-950/20' : ''}`}>
              <button type="button" onClick={() => onSelect(feedback)} className="mb-3 block w-full text-left">
                <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{feedback.user}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs ${feedback.status === 'new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : feedback.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {feedback.status}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">{feedback.channel}</span>
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
              </button>
              {feedback.response ? (
                <p className="rounded-lg bg-white px-3 py-2 text-sm text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700">
                  Response: {feedback.response}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {feedback.status === 'new' ? (
                  <Button variant="secondary" onClick={() => onMarkReviewed(feedback.id)} className="gap-2">
                    <Users className="h-4 w-4" />
                    Mark Reviewed
                  </Button>
                ) : null}
                <Button variant="secondary" onClick={() => onSelect(feedback)} className="gap-2">
                  <Send className="h-4 w-4" />
                  Draft Response
                </Button>
                <Button variant="secondary" onClick={() => onDelete(feedback.id)} className="gap-2 text-red-600 dark:text-red-300">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </article>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No feedback matches this view.
          </div>
        )}
      </div>
    </section>
  );
}

function FeedbackResponsePanel({
  feedback,
  onResolve,
  onResponseChange,
  onTemplateSelect,
  responseDraft,
}: {
  feedback: FeedbackRecord | null;
  onResolve: () => void;
  onResponseChange: (value: string) => void;
  onTemplateSelect: (value: string) => void;
  responseDraft: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Response Desk</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {feedback ? `Reply to ${feedback.user}'s ${feedback.channel} feedback.` : 'Select feedback to prepare a response.'}
          </p>
        </div>

        {feedback ? (
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-semibold text-gray-900 dark:text-white">{feedback.user}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{feedback.rating}/5</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{feedback.comment}</p>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Templates</p>
          {responseTemplates.map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => onTemplateSelect(template)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-sm text-gray-600 transition hover:border-green-300 hover:bg-green-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              {template}
            </button>
          ))}
        </div>

        <FormField label="Response">
          <textarea
            value={responseDraft}
            onChange={(event) => onResponseChange(event.target.value)}
            className="form-input min-h-36 resize-none"
            placeholder="Write a response"
          />
        </FormField>

        <Button onClick={onResolve} disabled={!feedback} className="w-full justify-center gap-2">
          <Send className="h-4 w-4" />
          Send and Resolve
        </Button>
      </CardContent>
    </Card>
  );
}
