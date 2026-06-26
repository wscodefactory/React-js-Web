import { CalendarDays, Plus, Trash2, User } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, FormField, Input } from '../../components/common';
import type { AppLanguage } from '../../context/LanguageContext';
import type { CleaningAppointment } from '../../types/showcase';
import { appointmentStatusClassMap } from './constants';
import { getCleaningDisplayText } from './copy';
import type { CleaningText } from './types';

type AppointmentsPanelProps = {
  appointments: CleaningAppointment[];
  cleaningText: CleaningText;
  language: AppLanguage;
  newAppointmentCleaner: string;
  newAppointmentDate: string;
  newAppointmentLocation: string;
  onAddAppointment: () => void;
  onDeleteAppointment: (id: number) => void;
  onNewAppointmentCleanerChange: (value: string) => void;
  onNewAppointmentDateChange: (value: string) => void;
  onNewAppointmentLocationChange: (value: string) => void;
  onToggleStatus: (id: number) => void;
};

export function AppointmentsPanel({
  appointments,
  cleaningText,
  language,
  newAppointmentCleaner,
  newAppointmentDate,
  newAppointmentLocation,
  onAddAppointment,
  onDeleteAppointment,
  onNewAppointmentCleanerChange,
  onNewAppointmentDateChange,
  onNewAppointmentLocationChange,
  onToggleStatus,
}: AppointmentsPanelProps) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader title={cleaningText.upcomingAppointmentsTitle} description={cleaningText.upcomingAppointmentsDescription} />
      <CardContent className="space-y-5">
        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
          {appointments.map((appointment) => {
            const displayCleaner = getCleaningDisplayText(language, appointment.cleaner);
            const displayLocation = getCleaningDisplayText(language, appointment.location);

            return (
              <div key={appointment.id} className="p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{appointment.date}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{displayLocation}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleStatus(appointment.id)}
                    className={`rounded-full px-3 py-1 text-xs ${appointmentStatusClassMap[appointment.status]}`}
                  >
                    {cleaningText.status[appointment.status]}
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {displayCleaner}
                  </span>
                  <Button variant="secondary" onClick={() => onDeleteAppointment(appointment.id)} className="gap-2 text-red-600 dark:text-red-300">
                    <Trash2 className="h-4 w-4" />
                    {cleaningText.remove}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-green-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">{cleaningText.addAppointmentTitle}</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <FormField label={cleaningText.date}>
              <Input type="date" value={newAppointmentDate} onChange={(event) => onNewAppointmentDateChange(event.target.value)} />
            </FormField>
            <FormField label={cleaningText.location}>
              <Input value={newAppointmentLocation} onChange={(event) => onNewAppointmentLocationChange(event.target.value)} placeholder={cleaningText.visitNamePlaceholder} />
            </FormField>
            <FormField label={cleaningText.cleaner}>
              <Input value={newAppointmentCleaner} onChange={(event) => onNewAppointmentCleanerChange(event.target.value)} placeholder={cleaningText.cleanerPlaceholder} />
            </FormField>
          </div>
          <Button onClick={onAddAppointment} className="mt-4 justify-center gap-2">
            <Plus className="h-4 w-4" />
            {cleaningText.addAppointment}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
