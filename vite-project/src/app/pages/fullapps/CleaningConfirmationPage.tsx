import { CheckCircle2, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/components/common';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { cleaningAppointments, cleaningSessionDetails, cleaningTasks } from '@/app/data/showcase';

const completedCount = cleaningTasks.filter((task) => task.completed).length;
const progressPercent = Math.round((completedCount / cleaningTasks.length) * 100);

export function CleaningConfirmationPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <PageIntro
        highlight="Cleaning Confirmation"
        title="Dashboard"
        description="Track and confirm cleaning tasks and appointments"
      />

      <CurrentSessionPanel />
      <AppointmentsPanel />
    </div>
  );
}

function CurrentSessionPanel() {
  return (
    <Card>
      <CardHeader
        title="Today's Cleaning Session"
        description="Live progress for the active appointment."
        badge={
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
            In Progress
          </span>
        }
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
          {cleaningTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    task.completed ? 'bg-green-600 dark:bg-green-500' : 'border-2 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {task.completed ? <CheckCircle2 className="h-4 w-4 text-white" /> : null}
                </div>
                <span className={task.completed ? 'text-gray-500 line-through dark:text-gray-500' : 'text-gray-900 dark:text-white'}>
                  {task.room}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{task.time}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-2 rounded-full bg-green-600 dark:bg-green-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentsPanel() {
  return (
    <Card>
      <CardHeader title="Upcoming Appointments" description="Upcoming visits and assigned cleaners." />
      <CardContent className="divide-y divide-gray-200 p-0 dark:divide-gray-700">
        {cleaningAppointments.map((appointment) => (
          <div key={appointment.id} className="p-6">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{appointment.date}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.location}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  appointment.status === 'Confirmed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}
              >
                {appointment.status}
              </span>
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
