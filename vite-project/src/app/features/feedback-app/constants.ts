import type { FeedbackChannel, FeedbackStatus, RatingFilter } from './types';

export const feedbackWorkspaceStorageKey = 'web5:feedback-workspace:v1';

export const feedbackStatuses: FeedbackStatus[] = ['new', 'reviewed', 'resolved'];

export const feedbackChannels: FeedbackChannel[] = ['Web', 'Email', 'In-app'];

export const ratingFilters: RatingFilter[] = ['all', 'high', 'needs-review', 'resolved'];

export const feedbackStatusClassMap: Record<FeedbackStatus, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  reviewed: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};
