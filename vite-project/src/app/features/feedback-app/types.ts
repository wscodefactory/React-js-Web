import type { AppLanguage } from '../../context/LanguageContext';
import type { FeedbackEntry } from '../../types/showcase';

export type FeedbackStatus = 'new' | 'reviewed' | 'resolved';
export type RatingFilter = 'all' | 'high' | 'needs-review' | 'resolved';
export type FeedbackChannel = 'Web' | 'Email' | 'In-app';

export type FeedbackRecord = FeedbackEntry & {
  channel: FeedbackChannel;
  response?: string;
  status: FeedbackStatus;
};

export type FeedbackWorkspaceDraft = {
  draftChannel: FeedbackChannel;
  draftComment: string;
  draftRating: number;
  draftUser: string;
  items: FeedbackRecord[];
  responseDraft: string;
  selectedFeedbackId: number | null;
};

export type FeedbackWorkspaceState = {
  restored: boolean;
  workspace: FeedbackWorkspaceDraft;
};

export type FeedbackAppText = {
  addFeedback: string;
  captureDescription: string;
  captureTitle: string;
  channel: string;
  comment: string;
  csvHeaders: readonly string[];
  customer: string;
  customerPlaceholder: string;
  delete: string;
  draftResponse: string;
  exportCsv: string;
  exportJson: string;
  feedbackAdded: (user: string) => string;
  inboxDescription: string;
  inboxTitle: string;
  invalidDraft: string;
  markReviewed: string;
  metrics: {
    averageRating: string;
    newThisSession: string;
    openItems: string;
    reviewed: string;
    totalFeedback: string;
  };
  noFeedback: string;
  noResponse: string;
  noSelection: string;
  pageDescription: string;
  pageHighlight: string;
  pageTitle: string;
  rating: string;
  ratingAria: (rating: number) => string;
  ready: string;
  removed: (user: string) => string;
  removedFallback: string;
  reset: string;
  resetDone: string;
  resolved: (user: string) => string;
  response: string;
  responseDraftPlaceholder: string;
  responsePrefix: string;
  responseTemplates: readonly string[];
  restored: string;
  reviewed: string;
  searchPlaceholder: string;
  sendAndResolve: string;
  status: Record<FeedbackStatus, string>;
  summaryPlaceholder: string;
  templates: string;
  workspaceReady: string;
};

export type FeedbackAppCopy = Record<AppLanguage, FeedbackAppText>;
