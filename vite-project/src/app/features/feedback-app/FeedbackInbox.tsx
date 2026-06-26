import { Download, Filter, RotateCcw, Search, Send, Star, Trash2, Users } from 'lucide-react';
import { Button } from '../../components/common';
import type { AppLanguage } from '../../context/LanguageContext';
import { feedbackStatusClassMap, ratingFilters } from './constants';
import {
  feedbackFilterLabels,
  getFeedbackChannelLabel,
  getFeedbackDisplayText,
  getFeedbackStatusLabel,
} from './copy';
import type { FeedbackAppText, FeedbackRecord, RatingFilter } from './types';

type FeedbackInboxProps = {
  activeFilter: RatingFilter;
  feedbackItems: FeedbackRecord[];
  feedbackText: FeedbackAppText;
  language: AppLanguage;
  searchQuery: string;
  selectedId: number | null;
  onDelete: (id: number) => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onFilterChange: (value: RatingFilter) => void;
  onMarkReviewed: (id: number) => void;
  onQueryChange: (value: string) => void;
  onReset: () => void;
  onSelect: (feedback: FeedbackRecord) => void;
};

export function FeedbackInbox({
  activeFilter,
  feedbackItems,
  feedbackText,
  language,
  searchQuery,
  selectedId,
  onDelete,
  onExportCsv,
  onExportJson,
  onFilterChange,
  onMarkReviewed,
  onQueryChange,
  onReset,
  onSelect,
}: FeedbackInboxProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-4 border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-gray-900 dark:text-white">{feedbackText.inboxTitle}</h2>
            <p className="break-words text-sm text-gray-500 [overflow-wrap:anywhere] dark:text-gray-400">{feedbackText.inboxDescription}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onExportCsv} className="w-fit gap-2">
              <Download className="h-4 w-4" />
              {feedbackText.exportCsv}
            </Button>
            <Button variant="secondary" onClick={onExportJson} className="w-fit gap-2">
              <Download className="h-4 w-4" />
              {feedbackText.exportJson}
            </Button>
            <Button variant="secondary" onClick={onReset} className="w-fit gap-2">
              <RotateCcw className="h-4 w-4" />
              {feedbackText.reset}
            </Button>
          </div>
        </div>

        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={feedbackText.searchPlaceholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {ratingFilters.map((ratingFilter) => (
            <button
              key={ratingFilter}
              type="button"
              onClick={() => onFilterChange(ratingFilter)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                activeFilter === ratingFilter
                  ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {feedbackFilterLabels[language][ratingFilter]}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {feedbackItems.length > 0 ? (
          feedbackItems.map((feedback) => {
            const displayUser = getFeedbackDisplayText(language, feedback.user);
            const displayComment = getFeedbackDisplayText(language, feedback.comment);

            return (
              <article key={feedback.id} className={`p-6 ${selectedId === feedback.id ? 'bg-green-50/60 dark:bg-green-950/20' : ''}`}>
                <button type="button" onClick={() => onSelect(feedback)} className="mb-3 block w-full text-left">
                  <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words font-semibold text-gray-900 dark:text-white">{displayUser}</h3>
                        <span className={`rounded-full px-2 py-1 text-xs ${feedbackStatusClassMap[feedback.status]}`}>
                          {getFeedbackStatusLabel(language, feedback.status)}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">{getFeedbackChannelLabel(language, feedback.channel)}</span>
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
                  <p className="break-words text-gray-600 [overflow-wrap:anywhere] dark:text-gray-400">{displayComment}</p>
                </button>
                {feedback.response ? (
                  <p className="break-words rounded-lg bg-white px-3 py-2 text-sm text-gray-600 ring-1 ring-gray-200 [overflow-wrap:anywhere] dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700">
                    {feedbackText.responsePrefix} {feedback.response}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {feedback.status === 'new' ? (
                    <Button variant="secondary" onClick={() => onMarkReviewed(feedback.id)} className="gap-2">
                      <Users className="h-4 w-4" />
                      {feedbackText.markReviewed}
                    </Button>
                  ) : null}
                  <Button variant="secondary" onClick={() => onSelect(feedback)} className="gap-2">
                    <Send className="h-4 w-4" />
                    {feedbackText.draftResponse}
                  </Button>
                  <Button variant="secondary" onClick={() => onDelete(feedback.id)} className="gap-2 text-red-600 dark:text-red-300">
                    <Trash2 className="h-4 w-4" />
                    {feedbackText.delete}
                  </Button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {feedbackText.noFeedback}
          </div>
        )}
      </div>
    </section>
  );
}
