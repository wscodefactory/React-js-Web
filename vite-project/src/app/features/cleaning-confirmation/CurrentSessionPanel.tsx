import { CheckCircle2, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, FormField, Input } from '../../components/common';
import type { AppLanguage } from '../../context/LanguageContext';
import { cleaningSessionDetails } from '../../data/showcase';
import type { CleaningTask } from '../../types/showcase';
import { sessionBadgeClassMap } from './constants';
import { getCleaningDisplayText, getLocalizedTaskTime, sessionBadgeLabels } from './copy';
import type { CleaningText, SessionBadge } from './types';

type CurrentSessionPanelProps = {
  cleaningText: CleaningText;
  completedCount: number;
  language: AppLanguage;
  newRoom: string;
  progressPercent: number;
  sessionBadge: SessionBadge;
  cleaningTasks: CleaningTask[];
  onAddTask: () => void;
  onMarkAllComplete: () => void;
  onNewRoomChange: (value: string) => void;
  onRemoveTask: (id: number) => void;
  onResetSession: () => void;
  onToggleTask: (id: number) => void;
};

export function CurrentSessionPanel({
  cleaningText,
  completedCount,
  language,
  newRoom,
  progressPercent,
  sessionBadge,
  cleaningTasks,
  onAddTask,
  onMarkAllComplete,
  onNewRoomChange,
  onRemoveTask,
  onResetSession,
  onToggleTask,
}: CurrentSessionPanelProps) {
  return (
    <Card>
      <CardHeader
        title={cleaningText.sessionTitle}
        description={cleaningText.completedRooms(completedCount, cleaningTasks.length)}
        badge={<span className={`rounded-full px-3 py-1 text-sm ${sessionBadgeClassMap[sessionBadge]}`}>{sessionBadgeLabels[language][sessionBadge]}</span>}
      />
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cleaningSessionDetails.map((detail) => {
            const Icon = detail.icon;
            const label = cleaningText.detailLabels[detail.label as keyof typeof cleaningText.detailLabels] ?? detail.label;
            const displayValue = getCleaningDisplayText(language, detail.value);
            return (
              <div key={detail.label} className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{displayValue}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{cleaningText.overallProgress}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-2 rounded-full bg-green-600 transition-all dark:bg-green-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onMarkAllComplete} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {cleaningText.completeAll}
          </Button>
          <Button variant="secondary" onClick={onResetSession} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {cleaningText.resetSession}
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">{cleaningText.taskChecklist}</h3>
          {cleaningTasks.map((task) => {
            const displayRoom = getCleaningDisplayText(language, task.room);

            return (
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
                    {displayRoom}
                  </span>
                </button>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{getLocalizedTaskTime(language, task.time)}</span>
                  <Button variant="secondary" onClick={() => onRemoveTask(task.id)} aria-label={`${cleaningText.remove} ${displayRoom}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700 md:grid-cols-[1fr_auto]">
          <FormField label={cleaningText.addRoomLabel}>
            <Input value={newRoom} onChange={(event) => onNewRoomChange(event.target.value)} placeholder={cleaningText.roomNamePlaceholder} />
          </FormField>
          <div className="flex items-end">
            <Button onClick={onAddTask} className="w-full justify-center gap-2">
              <Plus className="h-4 w-4" />
              {cleaningText.addRoom}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
