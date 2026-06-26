import { feedbackEntries } from '../../data/showcase';
import type { FeedbackRecord, FeedbackWorkspaceDraft } from './types';

export const initialFeedbackRecords: FeedbackRecord[] = feedbackEntries.map((entry, index) => ({
  ...entry,
  channel: index === 0 ? 'Web' : index === 1 ? 'Email' : 'In-app',
  status: index === 0 ? 'new' : 'reviewed',
}));

export const starterFeedbackCount = feedbackEntries.length;

export const fallbackFeedbackWorkspace: FeedbackWorkspaceDraft = {
  draftChannel: 'Web',
  draftComment: 'Fast response and clear handoff.',
  draftRating: 5,
  draftUser: 'New customer',
  items: initialFeedbackRecords,
  responseDraft: 'Thanks for the thoughtful feedback. We reviewed it with the team and will fold it into the next pass.',
  selectedFeedbackId: initialFeedbackRecords[0]?.id ?? null,
};
