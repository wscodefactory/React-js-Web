import { useMemo, useState } from 'react';
import { CheckCircle2, User } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '@/app/components/common';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { cleaningAppointments, cleaningSessionDetails, cleaningTasks } from '@/app/data/showcase';
import type { CleaningAppointment, CleaningTask } from '@/app/types/showcase';

export function CleaningConfirmationPage() {
  const [tasks, setTasks] = useState<CleaningTask[]>(cleaningTasks);
  const [appointments, setAppointments] = useState<CleaningAppointment[]>(cleaningAppointments);
  const [notes, setNotes] = useState('Entryway supplies restocked. Bedrooms pending final inspection.');
  const [confirmed, setConfirmed] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Tap checklist items as rooms are completed.');

  const completedCount = tasks.filter((task) => task.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);
  const allComplete = completedCount === tasks.length;

  const sessionBadge = useMemo(() => {
    if (confirmed) return 'Confirmed';
    if (allComplete) return 'Ready to Confirm';
    return 'In Progress';
  }, [allComplete, confirmed]);

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

  const toggleAppointmentStatus = (id: number) => {
    setAppointments((current) => current.map((appointment) => (
      appointment.id === id
        ? { ...appointment, status: appointment.status === 'Confirmed' ? 'Pending' : 'Confirmed' }
        : appointment
    )));
    setStatusMessage('Appointment status updated.');
  };

  const confirmSession = () => {
    if (!allComplete) {
      setStatusMessage('Complete every room before confirming the session.');
      return;
    }

    setConfirmed(true);
    setStatusMessage('Cleaning session confirmed with notes attached.');
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageIntro
        highlight="Cleaning Confirmation"
        title="Dashboard"
        description="Track and confirm cleaning tasks and appointments"
      />

      <CurrentSessionPanel
        tasks={tasks}
        completedCount={completedCount}
        progressPercent={progressPercent}
        sessionBadge={sessionBadge}
        onToggleTask={toggleTask}
      />

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <AppointmentsPanel appointments={appointments} onToggleStatus={toggleAppointmentStatus} />

        <Card>
          <CardHeader title="Completion Notes" description="Add closeout notes and confirm only after every task is done." />
          <CardContent className="space-y-4">
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="form-input min-h-32 resize-none"
              placeholder="Write completion notes"
            />
            <Button onClick={confirmSession} disabled={!allComplete} className="w-full justify-center">
              Confirm Completion
            </Button>
            <p className={`rounded-lg px-3 py-2 text-sm ${confirmed ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}`}>
              {statusMessage}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function CurrentSessionPanel({
  tasks,
  completedCount,
  progressPercent,
  sessionBadge,
  onToggleTask,
}: {
  tasks: CleaningTask[];
  completedCount: number;
  progressPercent: number;
  sessionBadge: string;
  onToggleTask: (id: number) => void;
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

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Task Checklist</h3>
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onToggleTask(task.id)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-left transition hover:border-green-300 dark:border-gray-700"
            >
              <span className="flex items-center gap-3">
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
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{task.time}</span>
            </button>
          ))}
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
      </CardContent>
    </Card>
  );
}

function AppointmentsPanel({
  appointments,
  onToggleStatus,
}: {
  appointments: CleaningAppointment[];
  onToggleStatus: (id: number) => void;
}) {
  return (
    <Card>
      <CardHeader title="Upcoming Appointments" description="Upcoming visits and assigned cleaners." />
      <CardContent className="divide-y divide-gray-200 p-0 dark:divide-gray-700">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="p-6">
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
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{appointment.cleaner}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
