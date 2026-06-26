import type { FeedbackRecord } from './types';

export function downloadFeedbackCsv(feedbackItems: FeedbackRecord[], headers: readonly string[]) {
  const rows = [
    [...headers],
    ...feedbackItems.map((item) => [
      item.user,
      String(item.rating),
      item.status,
      item.channel,
      item.date,
      item.comment,
      item.response ?? '',
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'feedback-export.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadFeedbackJson(content: unknown, fileName: string) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
