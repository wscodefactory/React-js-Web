import type { CleaningAppointmentStatus, SessionBadge } from './types';

export const cleaningWorkspaceStorageKey = 'web5:cleaning-confirmation-workspace:v1';

export const appointmentStatuses: CleaningAppointmentStatus[] = ['Confirmed', 'Pending'];

export const sessionBadgeClassMap: Record<SessionBadge, string> = {
  Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'In Progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Ready to Confirm': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

export const appointmentStatusClassMap: Record<CleaningAppointmentStatus, string> = {
  Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};
