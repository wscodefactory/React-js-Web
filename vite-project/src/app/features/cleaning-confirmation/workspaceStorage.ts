import type { CleaningAppointment, CleaningTask } from '../../types/showcase';
import { appointmentStatuses, cleaningWorkspaceStorageKey } from './constants';
import { fallbackCleaningWorkspace } from './data';
import type { CleaningAppointmentStatus, CleaningWorkspaceDraft, CleaningWorkspaceState } from './types';

function isCleaningTask(value: unknown): value is CleaningTask {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CleaningTask>;
  return typeof candidate.id === 'number'
    && typeof candidate.room === 'string'
    && typeof candidate.completed === 'boolean'
    && typeof candidate.time === 'string';
}

function isCleaningAppointment(value: unknown): value is CleaningAppointment {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CleaningAppointment>;
  return typeof candidate.id === 'number'
    && typeof candidate.date === 'string'
    && typeof candidate.location === 'string'
    && typeof candidate.cleaner === 'string'
    && appointmentStatuses.includes(candidate.status as CleaningAppointmentStatus);
}

export function readStoredCleaningWorkspace(): CleaningWorkspaceState {
  if (typeof window === 'undefined') {
    return { restored: false, workspace: fallbackCleaningWorkspace };
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(cleaningWorkspaceStorageKey) ?? 'null') as Partial<CleaningWorkspaceDraft> | null;

    if (
      !parsed
      || !Array.isArray(parsed.tasks)
      || parsed.tasks.length === 0
      || !Array.isArray(parsed.appointments)
      || !parsed.tasks.every(isCleaningTask)
      || !parsed.appointments.every(isCleaningAppointment)
    ) {
      return { restored: false, workspace: fallbackCleaningWorkspace };
    }

    return {
      restored: true,
      workspace: {
        appointments: parsed.appointments,
        confirmed: typeof parsed.confirmed === 'boolean' ? parsed.confirmed : fallbackCleaningWorkspace.confirmed,
        newAppointmentCleaner: typeof parsed.newAppointmentCleaner === 'string' ? parsed.newAppointmentCleaner : fallbackCleaningWorkspace.newAppointmentCleaner,
        newAppointmentDate: typeof parsed.newAppointmentDate === 'string' ? parsed.newAppointmentDate : fallbackCleaningWorkspace.newAppointmentDate,
        newAppointmentLocation: typeof parsed.newAppointmentLocation === 'string' ? parsed.newAppointmentLocation : fallbackCleaningWorkspace.newAppointmentLocation,
        newRoom: typeof parsed.newRoom === 'string' ? parsed.newRoom : fallbackCleaningWorkspace.newRoom,
        notes: typeof parsed.notes === 'string' ? parsed.notes : fallbackCleaningWorkspace.notes,
        tasks: parsed.tasks,
      },
    };
  } catch {
    return { restored: false, workspace: fallbackCleaningWorkspace };
  }
}
