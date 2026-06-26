import { Send } from 'lucide-react';
import { Button, Card, CardContent, FormField } from '../../components/common';
import type { AppLanguage } from '../../context/LanguageContext';
import { getFeedbackChannelLabel, getFeedbackDisplayText } from './copy';
import type { FeedbackAppText, FeedbackRecord } from './types';

type FeedbackResponsePanelProps = {
  feedback: FeedbackRecord | null;
  feedbackText: FeedbackAppText;
  language: AppLanguage;
  responseDraft: string;
  onResolve: () => void;
  onResponseChange: (value: string) => void;
  onTemplateSelect: (value: string) => void;
};

export function FeedbackResponsePanel({
  feedback,
  feedbackText,
  language,
  responseDraft,
  onResolve,
  onResponseChange,
  onTemplateSelect,
}: FeedbackResponsePanelProps) {
  const displayUser = feedback ? getFeedbackDisplayText(language, feedback.user) : '';
  const displayComment = feedback ? getFeedbackDisplayText(language, feedback.comment) : '';

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardContent className="min-w-0 space-y-4">
        <div>
          <h2 className="break-words text-xl font-semibold text-gray-900 dark:text-white">{feedbackText.response}</h2>
          <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere] dark:text-gray-400">
            {feedback
              ? language === 'ko'
                ? `${displayUser}님의 ${getFeedbackChannelLabel(language, feedback.channel)} 피드백에 응답합니다.`
                : `Reply to ${displayUser}'s ${getFeedbackChannelLabel(language, feedback.channel)} feedback.`
              : feedbackText.noSelection}
          </p>
        </div>

        {feedback ? (
          <div className="min-w-0 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="break-words font-semibold text-gray-900 dark:text-white">{displayUser}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{feedback.rating}/5</span>
            </div>
            <p className="break-words text-sm text-gray-600 [overflow-wrap:anywhere] dark:text-gray-300">{displayComment}</p>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{feedbackText.templates}</p>
          {feedbackText.responseTemplates.map((template) => (
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

        <FormField label={feedbackText.response}>
          <textarea
            value={responseDraft}
            onChange={(event) => onResponseChange(event.target.value)}
            className="form-input min-h-36 resize-none"
            placeholder={feedbackText.responseDraftPlaceholder}
          />
        </FormField>

        <Button onClick={onResolve} disabled={!feedback} className="w-full justify-center gap-2">
          <Send className="h-4 w-4" />
          {feedbackText.sendAndResolve}
        </Button>
      </CardContent>
    </Card>
  );
}
