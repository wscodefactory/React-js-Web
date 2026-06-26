import type { AppLanguage } from '../../context/LanguageContext';
import type { CleaningTask } from '../../types/showcase';
import { cleaningCopy, getCleaningDisplayText, getLocalizedTaskTime } from './copy';

export function buildSessionSummary(cleaningTasks: CleaningTask[], completionNotes: string, confirmed: boolean, language: AppLanguage) {
  const text = cleaningCopy[language];
  const completedRooms = cleaningTasks
    .filter((task) => task.completed)
    .map((task) => `${getCleaningDisplayText(language, task.room)} (${getLocalizedTaskTime(language, task.time)})`);

  return [
    text.summaryStatus(confirmed),
    text.completedRooms(completedRooms.length, cleaningTasks.length),
    ...completedRooms.map((room) => `- ${room}`),
    '',
    `${text.notes}: ${completionNotes ? getCleaningDisplayText(language, completionNotes) : text.noNotes}`,
  ].join('\n');
}

export function downloadTextFile(content: string, fileName: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(content: unknown, fileName: string) {
  downloadTextFile(JSON.stringify(content, null, 2), fileName, 'application/json;charset=utf-8');
}
