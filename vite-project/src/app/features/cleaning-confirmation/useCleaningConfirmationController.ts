import { useEffect, useMemo, useState } from 'react';
import type { CleaningAppointment, CleaningTask } from '../../types/showcase';
import { useLanguage } from '../../context/LanguageContext';
import { copyTextToClipboard } from '../../utils/clipboard';
import { removeStoredValue, saveStoredJson } from '../../utils/storage';
import { cleaningWorkspaceStorageKey } from './constants';
import { cleaningCopy, getCleaningDisplayText } from './copy';
import { fallbackCleaningWorkspace } from './data';
import { buildSessionSummary, downloadJsonFile, downloadTextFile } from './summaryExport';
import { readStoredCleaningWorkspace } from './workspaceStorage';
import type { SessionBadge } from './types';

export function useCleaningConfirmationController() {
  const { language } = useLanguage();
  const cleaningText = cleaningCopy[language];
  const [storedWorkspace] = useState(() => readStoredCleaningWorkspace());
  const [cleaningTasks, setCleaningTasks] = useState<CleaningTask[]>(storedWorkspace.workspace.tasks);
  const [appointments, setAppointments] = useState<CleaningAppointment[]>(storedWorkspace.workspace.appointments);
  const [completionNotes, setCompletionNotes] = useState(() => getCleaningDisplayText(language, storedWorkspace.workspace.notes));
  const [newRoom, setNewRoom] = useState(() => getCleaningDisplayText(language, storedWorkspace.workspace.newRoom));
  const [newAppointmentDate, setNewAppointmentDate] = useState(storedWorkspace.workspace.newAppointmentDate);
  const [newAppointmentLocation, setNewAppointmentLocation] = useState(() => getCleaningDisplayText(language, storedWorkspace.workspace.newAppointmentLocation));
  const [newAppointmentCleaner, setNewAppointmentCleaner] = useState(() => getCleaningDisplayText(language, storedWorkspace.workspace.newAppointmentCleaner));
  const [confirmed, setConfirmed] = useState(storedWorkspace.workspace.confirmed);
  const [statusMessage, setStatusMessage] = useState<string>(storedWorkspace.restored
    ? cleaningText.workspaceRestored
    : cleaningText.workspaceReadyInitial);

  const completedCount = cleaningTasks.filter((task) => task.completed).length;
  const progressPercent = cleaningTasks.length > 0 ? Math.round((completedCount / cleaningTasks.length) * 100) : 0;
  const allComplete = cleaningTasks.length > 0 && completedCount === cleaningTasks.length;

  const sessionBadge = useMemo<SessionBadge>(() => {
    if (confirmed) {
      return 'Confirmed';
    }

    if (allComplete) {
      return 'Ready to Confirm';
    }

    return 'In Progress';
  }, [allComplete, confirmed]);

  const sessionSummary = useMemo(
    () => buildSessionSummary(cleaningTasks, completionNotes, confirmed, language),
    [cleaningTasks, completionNotes, confirmed, language],
  );

  useEffect(() => {
    setStatusMessage(storedWorkspace.restored ? cleaningText.workspaceRestored : cleaningText.workspaceReadyInitial);
  }, [cleaningText.workspaceReadyInitial, cleaningText.workspaceRestored, storedWorkspace.restored]);

  useEffect(() => {
    saveStoredJson(cleaningWorkspaceStorageKey, {
      appointments,
      confirmed,
      newAppointmentCleaner,
      newAppointmentDate,
      newAppointmentLocation,
      newRoom,
      notes: completionNotes,
      tasks: cleaningTasks,
    });
  }, [appointments, cleaningTasks, completionNotes, confirmed, newAppointmentCleaner, newAppointmentDate, newAppointmentLocation, newRoom]);

  const toggleTask = (id: number) => {
    setCleaningTasks((currentTasks) => currentTasks.map((task) => {
      if (task.id !== id) {
        return task;
      }

      const completed = !task.completed;
      return {
        ...task,
        completed,
        time: completed ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending',
      };
    }));
    setConfirmed(false);
    setStatusMessage(cleaningText.taskUpdated);
  };

  const addTask = () => {
    const room = newRoom.trim();

    if (!room) {
      setStatusMessage(cleaningText.roomRequired);
      return;
    }

    setCleaningTasks((currentTasks) => [
      ...currentTasks,
      {
        id: Math.max(0, ...currentTasks.map((task) => task.id)) + 1,
        room,
        completed: false,
        time: 'Pending',
      },
    ]);
    setNewRoom('');
    setConfirmed(false);
    setStatusMessage(cleaningText.roomAdded(getCleaningDisplayText(language, room)));
  };

  const removeTask = (id: number) => {
    const task = cleaningTasks.find((item) => item.id === id);

    if (cleaningTasks.length === 1) {
      setStatusMessage(cleaningText.keepOneRoom);
      return;
    }

    setCleaningTasks((currentTasks) => currentTasks.filter((item) => item.id !== id));
    setConfirmed(false);
    setStatusMessage(task ? cleaningText.roomRemoved(getCleaningDisplayText(language, task.room)) : cleaningText.roomRemovedFallback);
  };

  const markAllComplete = () => {
    const completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCleaningTasks((currentTasks) => currentTasks.map((task) => ({ ...task, completed: true, time: task.completed ? task.time : completedAt })));
    setConfirmed(false);
    setStatusMessage(cleaningText.markAllComplete);
  };

  const resetSession = () => {
    setCleaningTasks(fallbackCleaningWorkspace.tasks);
    setAppointments(fallbackCleaningWorkspace.appointments);
    setCompletionNotes(getCleaningDisplayText(language, fallbackCleaningWorkspace.notes));
    setNewRoom(getCleaningDisplayText(language, fallbackCleaningWorkspace.newRoom));
    setNewAppointmentDate(fallbackCleaningWorkspace.newAppointmentDate);
    setNewAppointmentLocation(getCleaningDisplayText(language, fallbackCleaningWorkspace.newAppointmentLocation));
    setNewAppointmentCleaner(getCleaningDisplayText(language, fallbackCleaningWorkspace.newAppointmentCleaner));
    setConfirmed(fallbackCleaningWorkspace.confirmed);
    removeStoredValue(cleaningWorkspaceStorageKey);
    setStatusMessage(cleaningText.resetDone);
  };

  const toggleAppointmentStatus = (id: number) => {
    setAppointments((currentAppointments) => currentAppointments.map((appointment) => (
      appointment.id === id
        ? { ...appointment, status: appointment.status === 'Confirmed' ? 'Pending' : 'Confirmed' }
        : appointment
    )));
    setStatusMessage(cleaningText.appointmentStatusUpdated);
  };

  const addAppointment = () => {
    const location = newAppointmentLocation.trim();
    const cleaner = newAppointmentCleaner.trim();

    if (!newAppointmentDate || !location || !cleaner) {
      setStatusMessage(cleaningText.appointmentRequired);
      return;
    }

    setAppointments((currentAppointments) => [
      {
        id: Math.max(0, ...currentAppointments.map((appointment) => appointment.id)) + 1,
        date: newAppointmentDate,
        location,
        cleaner,
        status: 'Pending',
      },
      ...currentAppointments,
    ]);
    setStatusMessage(cleaningText.appointmentAdded(getCleaningDisplayText(language, location)));
    setNewAppointmentLocation('');
  };

  const deleteAppointment = (id: number) => {
    const appointment = appointments.find((item) => item.id === id);
    setAppointments((currentAppointments) => currentAppointments.filter((item) => item.id !== id));
    setStatusMessage(appointment ? cleaningText.appointmentRemoved(getCleaningDisplayText(language, appointment.location)) : cleaningText.appointmentRemovedFallback);
  };

  const confirmSession = () => {
    if (!allComplete) {
      setStatusMessage(cleaningText.completeBeforeConfirm);
      return;
    }

    setConfirmed(true);
    setStatusMessage(cleaningText.sessionConfirmed);
  };

  const copySummary = async () => {
    const wasCopied = await copyTextToClipboard(sessionSummary);
    setStatusMessage(wasCopied ? cleaningText.summaryCopied : cleaningText.clipboardFailed);
  };

  const downloadSummary = () => {
    downloadTextFile(sessionSummary, 'cleaning-confirmation-summary.txt', 'text/plain;charset=utf-8');
    setStatusMessage(cleaningText.summaryReady);
  };

  const exportWorkspace = () => {
    downloadJsonFile({
      appointments,
      confirmed,
      exportedAt: new Date().toISOString(),
      notes: completionNotes,
      summary: sessionSummary,
      tasks: cleaningTasks,
    }, 'cleaning-confirmation-workspace.json');
    setStatusMessage(cleaningText.workspaceReady);
  };

  return {
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
  };
}
