import { Plus, Star } from 'lucide-react';
import { Button, Card, CardContent, FormField, Input } from '../../components/common';
import type { AppLanguage } from '../../context/LanguageContext';
import { feedbackChannels } from './constants';
import { getFeedbackChannelLabel } from './copy';
import type { FeedbackAppText, FeedbackChannel } from './types';

type FeedbackCapturePanelProps = {
  draftChannel: FeedbackChannel;
  draftComment: string;
  draftRating: number;
  draftUser: string;
  language: AppLanguage;
  statusMessage: string;
  feedbackText: FeedbackAppText;
  onAddFeedback: () => void;
  onDraftChannelChange: (value: FeedbackChannel) => void;
  onDraftCommentChange: (value: string) => void;
  onDraftRatingChange: (value: number) => void;
  onDraftUserChange: (value: string) => void;
};

export function FeedbackCapturePanel({
  draftChannel,
  draftComment,
  draftRating,
  draftUser,
  language,
  statusMessage,
  feedbackText,
  onAddFeedback,
  onDraftChannelChange,
  onDraftCommentChange,
  onDraftRatingChange,
  onDraftUserChange,
}: FeedbackCapturePanelProps) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardContent className="min-w-0 space-y-4">
        <div>
          <h2 className="break-words text-xl font-semibold text-gray-900 dark:text-white">{feedbackText.captureTitle}</h2>
          <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere] dark:text-gray-400">{feedbackText.captureDescription}</p>
        </div>

        <FormField label={feedbackText.customer}>
          <Input value={draftUser} onChange={(event) => onDraftUserChange(event.target.value)} placeholder={feedbackText.customerPlaceholder} />
        </FormField>

        <FormField label={feedbackText.channel}>
          <select value={draftChannel} onChange={(event) => onDraftChannelChange(event.target.value as FeedbackChannel)} className="form-input">
            {feedbackChannels.map((channel) => (
              <option key={channel} value={channel}>{getFeedbackChannelLabel(language, channel)}</option>
            ))}
          </select>
        </FormField>

        <FormField label={feedbackText.comment}>
          <textarea
            value={draftComment}
            onChange={(event) => onDraftCommentChange(event.target.value)}
            placeholder={feedbackText.summaryPlaceholder}
            className="form-input min-h-28 resize-none"
          />
        </FormField>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{feedbackText.rating}</p>
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
                  aria-label={feedbackText.ratingAria(rating)}
                >
                  <Star className="h-4 w-4 fill-current" />
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={onAddFeedback} className="w-full justify-center gap-2">
          <Plus className="h-4 w-4" />
          {feedbackText.addFeedback}
        </Button>
        <p className="break-words rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 [overflow-wrap:anywhere] dark:bg-gray-900 dark:text-gray-400">{statusMessage}</p>
      </CardContent>
    </Card>
  );
}
