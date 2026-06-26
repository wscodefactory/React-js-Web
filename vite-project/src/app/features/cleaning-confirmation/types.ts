import type { AppLanguage } from '../../context/LanguageContext';
import type { CleaningAppointment, CleaningTask } from '../../types/showcase';

export type CleaningAppointmentStatus = CleaningAppointment['status'];
export type SessionBadge = 'Confirmed' | 'In Progress' | 'Ready to Confirm';

export type CleaningWorkspaceDraft = {
  appointments: CleaningAppointment[];
  confirmed: boolean;
  newAppointmentCleaner: string;
  newAppointmentDate: string;
  newAppointmentLocation: string;
  newRoom: string;
  notes: string;
  tasks: CleaningTask[];
};

export type CleaningWorkspaceState = {
  restored: boolean;
  workspace: CleaningWorkspaceDraft;
};

export type CleaningDetailLabel = 'Cleaner' | 'Location' | 'Started';

export type CleaningText = {
  addAppointment: string;
  addAppointmentTitle: string;
  addRoom: string;
  addRoomLabel: string;
  appointmentAdded: (location: string) => string;
  appointmentRemoved: (location: string) => string;
  appointmentRemovedFallback: string;
  appointmentRequired: string;
  appointmentStatusUpdated: string;
  cleaner: string;
  cleanerPlaceholder: string;
  clipboardFailed: string;
  completeAll: string;
  completeBeforeConfirm: string;
  completedRooms: (completed: number, total: number) => string;
  completionNotesDescription: string;
  completionNotesPlaceholder: string;
  completionNotesTitle: string;
  confirmCompletion: string;
  copySummary: string;
  date: string;
  detailLabels: Record<CleaningDetailLabel, string>;
  downloadSummary: string;
  exportWorkspace: string;
  keepOneRoom: string;
  location: string;
  markAllComplete: string;
  notes: string;
  noNotes: string;
  overallProgress: string;
  pageDescription: string;
  pageHighlight: string;
  pageTitle: string;
  pending: string;
  remove: string;
  resetDone: string;
  resetSession: string;
  roomAdded: (room: string) => string;
  roomNamePlaceholder: string;
  roomRequired: string;
  roomRemoved: (room: string) => string;
  roomRemovedFallback: string;
  sessionConfirmed: string;
  sessionTitle: string;
  status: Record<CleaningAppointmentStatus, string>;
  summaryCopied: string;
  summaryReady: string;
  summaryStatus: (confirmed: boolean) => string;
  taskChecklist: string;
  taskUpdated: string;
  upcomingAppointmentsDescription: string;
  upcomingAppointmentsTitle: string;
  visitNamePlaceholder: string;
  workspaceReady: string;
  workspaceReadyInitial: string;
  workspaceRestored: string;
};

export type CleaningCopy = Record<AppLanguage, CleaningText>;
