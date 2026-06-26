import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { FeedbackCapturePanel } from '@/app/features/feedback-app/FeedbackCapturePanel';
import { FeedbackInbox } from '@/app/features/feedback-app/FeedbackInbox';
import { FeedbackResponsePanel } from '@/app/features/feedback-app/FeedbackResponsePanel';
import { useFeedbackAppController } from '@/app/features/feedback-app/useFeedbackAppController';

export function FeedbackAppPage() {
  const {
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
  } = useFeedbackAppController();

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight={feedbackText.pageHighlight}
        title={feedbackText.pageTitle}
        description={feedbackText.pageDescription}
      />

      <MetricGrid items={metrics} columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5" />

      <section className="grid min-w-0 gap-6">
        <FeedbackCapturePanel
          draftChannel={draftChannel}
          draftComment={draftComment}
          draftRating={draftRating}
          draftUser={draftUser}
          feedbackText={feedbackText}
          language={language}
          statusMessage={statusMessage}
          onAddFeedback={addFeedback}
          onDraftChannelChange={setDraftChannel}
          onDraftCommentChange={setDraftComment}
          onDraftRatingChange={setDraftRating}
          onDraftUserChange={setDraftUser}
        />

        <FeedbackInbox
          activeFilter={activeFilter}
          feedbackItems={visibleFeedbackItems}
          feedbackText={feedbackText}
          language={language}
          searchQuery={searchQuery}
          selectedId={selectedFeedbackId}
          onDelete={deleteFeedback}
          onExportCsv={exportVisibleCsv}
          onExportJson={exportWorkspaceJson}
          onFilterChange={setActiveFilter}
          onMarkReviewed={markReviewed}
          onQueryChange={setSearchQuery}
          onReset={resetWorkspace}
          onSelect={selectFeedback}
        />

        <FeedbackResponsePanel
          feedback={selectedFeedback}
          feedbackText={feedbackText}
          language={language}
          responseDraft={responseDraft}
          onResolve={resolveFeedback}
          onResponseChange={setResponseDraft}
          onTemplateSelect={setResponseDraft}
        />
      </section>
    </div>
  );
}
