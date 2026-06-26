import { PageIntro } from '@/app/components/showcase/PageIntro';
import { AppointmentsPanel } from '@/app/features/cleaning-confirmation/AppointmentsPanel';
import { CompletionNotesPanel } from '@/app/features/cleaning-confirmation/CompletionNotesPanel';
import { CurrentSessionPanel } from '@/app/features/cleaning-confirmation/CurrentSessionPanel';
import { useCleaningConfirmationController } from '@/app/features/cleaning-confirmation/useCleaningConfirmationController';

export function CleaningConfirmationPage() {
  const {
    addAppointment,
    addTask,
    allComplete,
    appointments,
    cleaningTasks,
    cleaningText,
    completedCount,
    completionNotes,
    confirmed,
    confirmSession,
    copySummary,
    deleteAppointment,
    downloadSummary,
    exportWorkspace,
    language,
    markAllComplete,
    newAppointmentCleaner,
    newAppointmentDate,
    newAppointmentLocation,
    newRoom,
    progressPercent,
    removeTask,
    resetSession,
    sessionBadge,
    sessionSummary,
    setCompletionNotes,
    setNewAppointmentCleaner,
    setNewAppointmentDate,
    setNewAppointmentLocation,
    setNewRoom,
    statusMessage,
    toggleAppointmentStatus,
    toggleTask,
  } = useCleaningConfirmationController();

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight={cleaningText.pageHighlight}
        title={cleaningText.pageTitle}
        description={cleaningText.pageDescription}
      />

      <CurrentSessionPanel
        cleaningText={cleaningText}
        completedCount={completedCount}
        language={language}
        newRoom={newRoom}
        progressPercent={progressPercent}
        sessionBadge={sessionBadge}
        cleaningTasks={cleaningTasks}
        onAddTask={addTask}
        onMarkAllComplete={markAllComplete}
        onNewRoomChange={setNewRoom}
        onRemoveTask={removeTask}
        onResetSession={resetSession}
        onToggleTask={toggleTask}
      />

      <section className="grid min-w-0 gap-6">
        <AppointmentsPanel
          appointments={appointments}
          cleaningText={cleaningText}
          language={language}
          newAppointmentCleaner={newAppointmentCleaner}
          newAppointmentDate={newAppointmentDate}
          newAppointmentLocation={newAppointmentLocation}
          onAddAppointment={addAppointment}
          onDeleteAppointment={deleteAppointment}
          onNewAppointmentCleanerChange={setNewAppointmentCleaner}
          onNewAppointmentDateChange={setNewAppointmentDate}
          onNewAppointmentLocationChange={setNewAppointmentLocation}
          onToggleStatus={toggleAppointmentStatus}
        />

        <CompletionNotesPanel
          allComplete={allComplete}
          cleaningText={cleaningText}
          completionNotes={completionNotes}
          confirmed={confirmed}
          sessionSummary={sessionSummary}
          statusMessage={statusMessage}
          onConfirmSession={confirmSession}
          onCopySummary={copySummary}
          onDownloadSummary={downloadSummary}
          onExportWorkspace={exportWorkspace}
          onNotesChange={setCompletionNotes}
        />
      </section>
    </div>
  );
}
