import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, ClipboardCheck, Download, Plus, RotateCcw, Trash2, User } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, FormField, Input } from '@/app/components/common';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { cleaningAppointments, cleaningSessionDetails, cleaningTasks } from '@/app/data/showcase';
import type { CleaningAppointment, CleaningTask } from '@/app/types/showcase';
import { copyTextToClipboard } from '@/app/utils/clipboard';

type CleaningAppointmentStatus = CleaningAppointment['status'];
type CleaningWorkspaceDraft = {
  appointments: CleaningAppointment[];
  confirmed: boolean;
  newAppointmentCleaner: string;
  newAppointmentDate: string;
  newAppointmentLocation: string;
  newRoom: string;
  notes: string;
  tasks: CleaningTask[];
};

const cleaningWorkspaceStorageKey = 'web5:cleaning-confirmation-workspace:v1';
const appointmentStatuses: CleaningAppointmentStatus[] = ['Confirmed', 'Pending'];
const fallbackCleaningWorkspace: CleaningWorkspaceDraft = {
  appointments: cleaningAppointments,
  confirmed: false,
  newAppointmentCleaner: 'Sarah Johnson',
  newAppointmentDate: '2026-05-28',
  newAppointmentLocation: 'Retail Floor Refresh',
  newRoom: 'Laundry Room',
  notes: 'Entryway supplies restocked. Bedrooms pending final inspection.',
  tasks: cleaningTasks,
};

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

function readStoredCleaningWorkspace() {
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

function buildSessionSummary(tasks: CleaningTask[], notes: string, confirmed: boolean) {
  const completedRooms = tasks.filter((task) => task.completed).map((task) => `${task.room} (${task.time})`);

  return [
    `Cleaning status: ${confirmed ? 'Confirmed' : 'Not confirmed'}`,
    `Completed rooms: ${completedRooms.length}/${tasks.length}`,
    ...completedRooms.map((room) => `- ${room}`),
    '',
    `Notes: ${notes || 'No notes added.'}`,
  ].join('\n');
}

function downloadText(content: string, fileName: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadJson(content: unknown, fileName: string) {
  downloadText(JSON.stringify(content, null, 2), fileName, 'application/json;charset=utf-8');
}

export function CleaningConfirmationPage() {
  const [storedWorkspace] = useState(() => readStoredCleaningWorkspace());
  const [tasks, setTasks] = useState<CleaningTask[]>(storedWorkspace.workspace.tasks);
  const [appointments, setAppointments] = useState<CleaningAppointment[]>(storedWorkspace.workspace.appointments);
  const [notes, setNotes] = useState(storedWorkspace.workspace.notes);
  const [newRoom, setNewRoom] = useState(storedWorkspace.workspace.newRoom);
  const [newAppointmentDate, setNewAppointmentDate] = useState(storedWorkspace.workspace.newAppointmentDate);
  const [newAppointmentLocation, setNewAppointmentLocation] = useState(storedWorkspace.workspace.newAppointmentLocation);
  const [newAppointmentCleaner, setNewAppointmentCleaner] = useState(storedWorkspace.workspace.newAppointmentCleaner);
  const [confirmed, setConfirmed] = useState(storedWorkspace.workspace.confirmed);
  const [statusMessage, setStatusMessage] = useState(storedWorkspace.restored
    ? 'Cleaning workspace restored from local storage.'
    : 'Tap checklist items as rooms are completed.');

  const completedCount = tasks.filter((task) => task.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const allComplete = tasks.length > 0 && completedCount === tasks.length;

  const sessionBadge = useMemo(() => {
    if (confirmed) return 'Confirmed';
    if (allComplete) return 'Ready to Confirm';
    return 'In Progress';
  }, [allComplete, confirmed]);

  useEffect(() => {
    window.localStorage.setItem(cleaningWorkspaceStorageKey, JSON.stringify({
      appointments,
      confirmed,
      newAppointmentCleaner,
      newAppointmentDate,
      newAppointmentLocation,
      newRoom,
      notes,
      tasks,
    }));
  }, [appointments, confirmed, newAppointmentCleaner, newAppointmentDate, newAppointmentLocation, newRoom, notes, tasks]);

  const toggleTask = (id: number) => {
    setTasks((current) => current.map((task) => {
      if (task.id !== id) return task;
      const completed = !task.completed;
      return {
        ...task,
        completed,
        time: completed ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending',
      };
    }));
    setConfirmed(false);
    setStatusMessage('Checklist updated.');
  };

  const addTask = () => {
    const room = newRoom.trim();

    if (!room) {
      setStatusMessage('Add a room or area name before adding a checklist item.');
      return;
    }

    setTasks((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((task) => task.id)) + 1,
        room,
        completed: false,
        time: 'Pending',
      },
    ]);
    setNewRoom('');
    setConfirmed(false);
    setStatusMessage(`${room} added to the checklist.`);
  };

  const removeTask = (id: number) => {
    const task = tasks.find((item) => item.id === id);

    if (tasks.length === 1) {
      setStatusMessage('Keep at least one room in the checklist.');
      return;
    }

    setTasks((current) => current.filter((item) => item.id !== id));
    setConfirmed(false);
    setStatusMessage(task ? `${task.room} removed from the checklist.` : 'Checklist item removed.');
  };

  const markAllComplete = () => {
    const completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTasks((current) => current.map((task) => ({ ...task, completed: true, time: task.completed ? task.time : completedAt })));
    setConfirmed(false);
    setStatusMessage('All checklist items were marked complete.');
  };

  const resetSession = () => {
    setTasks(fallbackCleaningWorkspace.tasks);
    setAppointments(fallbackCleaningWorkspace.appointments);
    setNotes(fallbackCleaningWorkspace.notes);
    setNewRoom(fallbackCleaningWorkspace.newRoom);
    setNewAppointmentDate(fallbackCleaningWorkspace.newAppointmentDate);
    setNewAppointmentLocation(fallbackCleaningWorkspace.newAppointmentLocation);
    setNewAppointmentCleaner(fallbackCleaningWorkspace.newAppointmentCleaner);
    setConfirmed(fallbackCleaningWorkspace.confirmed);
    window.localStorage.removeItem(cleaningWorkspaceStorageKey);
    setStatusMessage('Cleaning workspace reset to the starter data.');
  };

  const toggleAppointmentStatus = (id: number) => {
    setAppointments((current) => current.map((appointment) => (
      appointment.id === id
        ? { ...appointment, status: appointment.status === 'Confirmed' ? 'Pending' : 'Confirmed' }
        : appointment
    )));
    setStatusMessage('Appointment status updated.');
  };

  const addAppointment = () => {
    const location = newAppointmentLocation.trim();
    const cleaner = newAppointmentCleaner.trim();

    if (!newAppointmentDate || !location || !cleaner) {
      setStatusMessage('Add a date, location, and cleaner before creating an appointment.');
      return;
    }

    setAppointments((current) => [
      {
        id: Math.max(0, ...current.map((appointment) => appointment.id)) + 1,
        date: newAppointmentDate,
        location,
        cleaner,
        status: 'Pending',
      },
      ...current,
    ]);
    setStatusMessage(`${location} appointment added.`);
    setNewAppointmentLocation('');
  };

  const deleteAppointment = (id: number) => {
    const appointment = appointments.find((item) => item.id === id);
    setAppointments((current) => current.filter((item) => item.id !== id));
    setStatusMessage(appointment ? `${appointment.location} appointment removed.` : 'Appointment removed.');
  };

  const confirmSession = () => {
    if (!allComplete) {
      setStatusMessage('Complete every room before confirming the session.');
      return;
    }

    setConfirmed(true);
    setStatusMessage('Cleaning session confirmed with notes attached.');
  };

  const copySummary = async () => {
    const wasCopied = await copyTextToClipboard(buildSessionSummary(tasks, notes, confirmed));
    setStatusMessage(wasCopied ? 'Cleaning summary copied to clipboard.' : 'Clipboard copy failed. Use the notes panel instead.');
  };

  const downloadSummary = () => {
    downloadText(buildSessionSummary(tasks, notes, confirmed), 'cleaning-confirmation-summary.txt', 'text/plain;charset=utf-8');
    setStatusMessage('Cleaning summary queued for download.');
  };

  const exportWorkspace = () => {
    downloadJson({
      appointments,
      confirmed,
      exportedAt: new Date().toISOString(),
      notes,
      summary: buildSessionSummary(tasks, notes, confirmed),
      tasks,
    }, 'cleaning-confirmation-workspace.json');
    setStatusMessage('Cleaning workspace queued for download.');
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight="Cleaning Confirmation"
        title="Dashboard"
        description="Track and confirm cleaning tasks and appointments"
      />

      <CurrentSessionPanel
        completedCount={completedCount}
        newRoom={newRoom}
        onAddTask={addTask}
        onMarkAllComplete={markAllComplete}
        onNewRoomChange={setNewRoom}
        onRemoveTask={removeTask}
        onResetSession={resetSession}
        onToggleTask={toggleTask}
        progressPercent={progressPercent}
        sessionBadge={sessionBadge}
        tasks={tasks}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <AppointmentsPanel
          appointments={appointments}
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

        <Card>
          <CardHeader title="Completion Notes" description="Add closeout notes and confirm only after every task is done." />
          <CardContent className="space-y-4">
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="form-input min-h-32 resize-none"
              placeholder="Write completion notes"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Button onClick={confirmSession} disabled={!allComplete} className="justify-center">
                Confirm Completion
              </Button>
              <Button variant="secondary" onClick={copySummary} className="justify-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Copy Summary
              </Button>
              <Button variant="secondary" onClick={downloadSummary} className="justify-center gap-2">
                <Download className="h-4 w-4" />
                Download Summary
              </Button>
              <Button variant="secondary" onClick={exportWorkspace} className="justify-center gap-2">
                <Download className="h-4 w-4" />
                Export Workspace
              </Button>
            </div>
            <p className={`rounded-lg px-3 py-2 text-sm ${confirmed ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}`}>
              {statusMessage}
            </p>
            <pre className="max-h-52 overflow-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
              <code>{buildSessionSummary(tasks, notes, confirmed)}</code>
            </pre>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function CurrentSessionPanel({
  completedCount,
  newRoom,
  onAddTask,
  onMarkAllComplete,
  onNewRoomChange,
  onRemoveTask,
  onResetSession,
  onToggleTask,
  progressPercent,
  sessionBadge,
  tasks,
}: {
  completedCount: number;
  newRoom: string;
  onAddTask: () => void;
  onMarkAllComplete: () => void;
  onNewRoomChange: (value: string) => void;
  onRemoveTask: (id: number) => void;
  onResetSession: () => void;
  onToggleTask: (id: number) => void;
  progressPercent: number;
  sessionBadge: string;
  tasks: CleaningTask[];
}) {
  const badgeClassName = sessionBadge === 'Confirmed'
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : sessionBadge === 'Ready to Confirm'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

  return (
    <Card>
      <CardHeader
        title="Today's Cleaning Session"
        description={`${completedCount} of ${tasks.length} rooms completed.`}
        badge={<span className={`rounded-full px-3 py-1 text-sm ${badgeClassName}`}>{sessionBadge}</span>}
      />
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cleaningSessionDetails.map((detail) => {
            const Icon = detail.icon;
            return (
              <div key={detail.label} className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{detail.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{detail.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-2 rounded-full bg-green-600 transition-all dark:bg-green-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onMarkAllComplete} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Mark all complete
          </Button>
          <Button variant="secondary" onClick={onResetSession} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset session
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Task Checklist</h3>
          {tasks.map((task) => (
            <div key={task.id} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => onToggleTask(task.id)} className="flex flex-1 items-center gap-3 text-left">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    task.completed ? 'bg-green-600 dark:bg-green-500' : 'border-2 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {task.completed ? <CheckCircle2 className="h-4 w-4 text-white" /> : null}
                </span>
                <span className={task.completed ? 'text-gray-500 line-through dark:text-gray-500' : 'text-gray-900 dark:text-white'}>
                  {task.room}
                </span>
              </button>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">{task.time}</span>
                <Button variant="secondary" onClick={() => onRemoveTask(task.id)} aria-label={`Remove ${task.room}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700 md:grid-cols-[1fr_auto]">
          <FormField label="Add room or area">
            <Input value={newRoom} onChange={(event) => onNewRoomChange(event.target.value)} placeholder="Room name" />
          </FormField>
          <div className="flex items-end">
            <Button onClick={onAddTask} className="w-full justify-center gap-2">
              <Plus className="h-4 w-4" />
              Add room
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentsPanel({
  appointments,
  newAppointmentCleaner,
  newAppointmentDate,
  newAppointmentLocation,
  onAddAppointment,
  onDeleteAppointment,
  onNewAppointmentCleanerChange,
  onNewAppointmentDateChange,
  onNewAppointmentLocationChange,
  onToggleStatus,
}: {
  appointments: CleaningAppointment[];
  newAppointmentCleaner: string;
  newAppointmentDate: string;
  newAppointmentLocation: string;
  onAddAppointment: () => void;
  onDeleteAppointment: (id: number) => void;
  onNewAppointmentCleanerChange: (value: string) => void;
  onNewAppointmentDateChange: (value: string) => void;
  onNewAppointmentLocationChange: (value: string) => void;
  onToggleStatus: (id: number) => void;
}) {
  return (
    <Card>
      <CardHeader title="Upcoming Appointments" description="Upcoming visits and assigned cleaners." />
      <CardContent className="space-y-5">
        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="p-5">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{appointment.date}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.location}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleStatus(appointment.id)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    appointment.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
                >
                  {appointment.status}
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {appointment.cleaner}
                </span>
                <Button variant="secondary" onClick={() => onDeleteAppointment(appointment.id)} className="gap-2 text-red-600 dark:text-red-300">
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-green-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Add appointment</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <FormField label="Date">
              <Input type="date" value={newAppointmentDate} onChange={(event) => onNewAppointmentDateChange(event.target.value)} />
            </FormField>
            <FormField label="Location">
              <Input value={newAppointmentLocation} onChange={(event) => onNewAppointmentLocationChange(event.target.value)} placeholder="Visit name" />
            </FormField>
            <FormField label="Cleaner">
              <Input value={newAppointmentCleaner} onChange={(event) => onNewAppointmentCleanerChange(event.target.value)} placeholder="Cleaner" />
            </FormField>
          </div>
          <Button onClick={onAddAppointment} className="mt-4 justify-center gap-2">
            <Plus className="h-4 w-4" />
            Add appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
