import { cleaningAppointments, cleaningTasks } from '../../data/showcase';
import type { CleaningWorkspaceDraft } from './types';

export const fallbackCleaningWorkspace: CleaningWorkspaceDraft = {
  appointments: cleaningAppointments,
  confirmed: false,
  newAppointmentCleaner: 'Sarah Johnson',
  newAppointmentDate: '2026-05-28',
  newAppointmentLocation: 'Retail Floor Refresh',
  newRoom: 'Laundry Room',
  notes: 'Entryway supplies restocked. Bedrooms pending final inspection.',
  tasks: cleaningTasks,
};
