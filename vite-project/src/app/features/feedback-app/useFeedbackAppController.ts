import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MessageSquare, Star, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { removeStoredValue, saveStoredJson } from '../../utils/storage';
import { feedbackWorkspaceStorageKey } from './constants';
import {
  feedbackAppCopy,
  getFeedbackChannelLabel,
  getFeedbackDisplayText,
  getFeedbackStatusLabel,
} from './copy';
import { fallbackFeedbackWorkspace, starterFeedbackCount } from './data';
import { downloadFeedbackCsv, downloadFeedbackJson } from './exportFeedback';
import { readStoredFeedbackWorkspace } from './workspaceStorage';
import type { FeedbackChannel, FeedbackRecord, RatingFilter } from './types';

export function useFeedbackAppController() {
  const { language } = useLanguage();
  const feedbackText = feedbackAppCopy[language];
  const [storedWorkspace] = useState(() => readStoredFeedbackWorkspace());
  const [feedbackItems, setFeedbackItems] = useState<FeedbackRecord[]>(storedWorkspace.workspace.items);
  const [activeFilter, setActiveFilter] = useState<RatingFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(storedWorkspace.workspace.selectedFeedbackId);
  const [responseDraft, setResponseDraft] = useState(storedWorkspace.workspace.responseDraft);
  const [draftUser, setDraftUser] = useState(() => getFeedbackDisplayText(language, storedWorkspace.workspace.draftUser));
  const [draftComment, setDraftComment] = useState(() => getFeedbackDisplayText(language, storedWorkspace.workspace.draftComment));
  const [draftChannel, setDraftChannel] = useState<FeedbackChannel>(storedWorkspace.workspace.draftChannel);
  const [draftRating, setDraftRating] = useState(storedWorkspace.workspace.draftRating);
  const [statusMessage, setStatusMessage] = useState<string>(storedWorkspace.restored
    ? feedbackText.restored
    : feedbackText.ready);

  const selectedFeedback = feedbackItems.find((item) => item.id === selectedFeedbackId) ?? null;

  const visibleFeedbackItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return feedbackItems.filter((item) => {
      const matchesRating = activeFilter === 'high'
        ? item.rating >= 4
        : activeFilter === 'needs-review'
          ? item.status === 'new' || item.rating <= 3
          : activeFilter === 'resolved'
            ? item.status === 'resolved'
            : true;
      const displayUser = getFeedbackDisplayText(language, item.user);
      const displayComment = getFeedbackDisplayText(language, item.comment);
      const matchesQuery = !normalizedQuery
        || `${item.user} ${displayUser} ${item.comment} ${displayComment} ${item.channel} ${getFeedbackChannelLabel(language, item.channel)} ${item.status} ${getFeedbackStatusLabel(language, item.status)}`.toLowerCase().includes(normalizedQuery);

      return matchesRating && matchesQuery;
    });
  }, [activeFilter, feedbackItems, language, searchQuery]);

  const metrics = useMemo(() => {
    const average = feedbackItems.length ? feedbackItems.reduce((sum, item) => sum + item.rating, 0) / feedbackItems.length : 0;
    const reviewedCount = feedbackItems.filter((item) => item.status !== 'new').length;
    const unresolvedCount = feedbackItems.filter((item) => item.status !== 'resolved').length;
    const growth = feedbackItems.length > starterFeedbackCount ? `+${feedbackItems.length - starterFeedbackCount}` : '+0';

    return [
      { label: feedbackText.metrics.totalFeedback, value: feedbackItems.length, accent: 'green' as const, icon: MessageSquare },
      { label: feedbackText.metrics.averageRating, value: average.toFixed(1), accent: 'yellow' as const, icon: Star },
      { label: feedbackText.metrics.reviewed, value: reviewedCount, accent: 'blue' as const, icon: CheckCircle2 },
      { label: feedbackText.metrics.openItems, value: unresolvedCount, accent: 'gray' as const, icon: TrendingUp },
      { label: feedbackText.metrics.newThisSession, value: growth, accent: 'gray' as const, icon: Users },
    ];
  }, [feedbackItems, feedbackText.metrics.averageRating, feedbackText.metrics.newThisSession, feedbackText.metrics.openItems, feedbackText.metrics.reviewed, feedbackText.metrics.totalFeedback]);

  useEffect(() => {
    setStatusMessage(storedWorkspace.restored ? feedbackText.restored : feedbackText.ready);
  }, [feedbackText.ready, feedbackText.restored, storedWorkspace.restored]);

  useEffect(() => {
    saveStoredJson(feedbackWorkspaceStorageKey, {
      draftChannel,
      draftComment,
      draftRating,
      draftUser,
      items: feedbackItems,
      responseDraft,
      selectedFeedbackId,
    });
  }, [draftChannel, draftComment, draftRating, draftUser, feedbackItems, responseDraft, selectedFeedbackId]);

  const addFeedback = () => {
    const user = draftUser.trim();
    const comment = draftComment.trim();

    if (!user || !comment) {
      setStatusMessage(feedbackText.invalidDraft);
      return;
    }

    const nextItem: FeedbackRecord = {
      id: Math.max(0, ...feedbackItems.map((item) => item.id)) + 1,
      user,
      channel: draftChannel,
      comment,
      rating: draftRating,
      date: new Date().toISOString().slice(0, 10),
      status: 'new',
    };

    setFeedbackItems((currentItems) => [nextItem, ...currentItems]);
    setSelectedFeedbackId(nextItem.id);
    setDraftComment('');
    setResponseDraft(feedbackText.responseTemplates[0]);
    setActiveFilter('all');
    setStatusMessage(feedbackText.feedbackAdded(user));
  };

  const markReviewed = (id: number) => {
    setFeedbackItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, status: item.status === 'resolved' ? 'resolved' : 'reviewed' } : item)));
    setSelectedFeedbackId(id);
    setStatusMessage(feedbackText.reviewed);
  };

  const selectFeedback = (feedback: FeedbackRecord) => {
    setSelectedFeedbackId(feedback.id);
    setResponseDraft(feedback.response ?? feedbackText.responseTemplates[0]);
  };

  const resolveFeedback = () => {
    if (!selectedFeedback) {
      setStatusMessage(feedbackText.noSelection);
      return;
    }

    const response = responseDraft.trim();

    if (!response) {
      setStatusMessage(feedbackText.noResponse);
      return;
    }

    setFeedbackItems((currentItems) => currentItems.map((item) => (
      item.id === selectedFeedback.id ? { ...item, response, status: 'resolved' } : item
    )));
    setStatusMessage(feedbackText.resolved(getFeedbackDisplayText(language, selectedFeedback.user)));
  };

  const deleteFeedback = (id: number) => {
    const target = feedbackItems.find((item) => item.id === id);
    const nextItems = feedbackItems.filter((item) => item.id !== id);

    setFeedbackItems(nextItems);
    setSelectedFeedbackId((current) => (current === id ? nextItems[0]?.id ?? null : current));
    setStatusMessage(target ? feedbackText.removed(getFeedbackDisplayText(language, target.user)) : feedbackText.removedFallback);
  };

  const exportWorkspaceJson = () => {
    downloadFeedbackJson({
      exportedAt: new Date().toISOString(),
      filter: activeFilter,
      items: feedbackItems,
      query: searchQuery,
      selectedFeedbackId,
    }, 'feedback-workspace.json');
    setStatusMessage(feedbackText.workspaceReady);
  };

  const exportVisibleCsv = () => {
    downloadFeedbackCsv(visibleFeedbackItems, feedbackText.csvHeaders);
  };

  const resetWorkspace = () => {
    setFeedbackItems(fallbackFeedbackWorkspace.items);
    setActiveFilter('all');
    setSearchQuery('');
    setSelectedFeedbackId(fallbackFeedbackWorkspace.selectedFeedbackId);
    setResponseDraft(feedbackText.responseTemplates[0]);
    setDraftUser(getFeedbackDisplayText(language, fallbackFeedbackWorkspace.draftUser));
    setDraftComment(getFeedbackDisplayText(language, fallbackFeedbackWorkspace.draftComment));
    setDraftChannel(fallbackFeedbackWorkspace.draftChannel);
    setDraftRating(fallbackFeedbackWorkspace.draftRating);
    removeStoredValue(feedbackWorkspaceStorageKey);
    setStatusMessage(feedbackText.resetDone);
  };

  return {
    activeFilter,
    addFeedback,
    deleteFeedback,
    draftChannel,
    draftComment,
    draftRating,
    draftUser,
    exportVisibleCsv,
    exportWorkspaceJson,
    feedbackText,
    language,
    markReviewed,
    metrics,
    resetWorkspace,
    resolveFeedback,
    responseDraft,
    searchQuery,
    selectFeedback,
    selectedFeedback,
    selectedFeedbackId,
    setActiveFilter,
    setDraftChannel,
    setDraftComment,
    setDraftRating,
    setDraftUser,
    setResponseDraft,
    setSearchQuery,
    statusMessage,
    visibleFeedbackItems,
  };
}
