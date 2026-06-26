import { feedbackChannels, feedbackStatuses, feedbackWorkspaceStorageKey } from './constants';
import { fallbackFeedbackWorkspace } from './data';
import type { FeedbackChannel, FeedbackRecord, FeedbackStatus, FeedbackWorkspaceDraft, FeedbackWorkspaceState } from './types';

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

export function readStoredFeedbackWorkspace(): FeedbackWorkspaceState {
  if (typeof window === 'undefined') {
    return { restored: false, workspace: fallbackFeedbackWorkspace };
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(feedbackWorkspaceStorageKey) ?? 'null') as Partial<FeedbackWorkspaceDraft> | null;

    if (!parsed || !Array.isArray(parsed.items) || !parsed.items.every(isFeedbackRecord)) {
      return { restored: false, workspace: fallbackFeedbackWorkspace };
    }

    const selectedFeedbackId = parsed.items.some((item) => item.id === parsed.selectedFeedbackId)
      ? Number(parsed.selectedFeedbackId)
      : parsed.items[0]?.id ?? null;

    return {
      restored: true,
      workspace: {
        draftChannel: feedbackChannels.includes(parsed.draftChannel as FeedbackChannel) ? parsed.draftChannel as FeedbackChannel : fallbackFeedbackWorkspace.draftChannel,
        draftComment: typeof parsed.draftComment === 'string' ? parsed.draftComment : fallbackFeedbackWorkspace.draftComment,
        draftRating: typeof parsed.draftRating === 'number' && parsed.draftRating >= 1 && parsed.draftRating <= 5
          ? Math.round(parsed.draftRating)
          : fallbackFeedbackWorkspace.draftRating,
        draftUser: typeof parsed.draftUser === 'string' ? parsed.draftUser : fallbackFeedbackWorkspace.draftUser,
        items: parsed.items,
        responseDraft: typeof parsed.responseDraft === 'string' ? parsed.responseDraft : fallbackFeedbackWorkspace.responseDraft,
        selectedFeedbackId,
      },
    };
  } catch {
    return { restored: false, workspace: fallbackFeedbackWorkspace };
  }
}
