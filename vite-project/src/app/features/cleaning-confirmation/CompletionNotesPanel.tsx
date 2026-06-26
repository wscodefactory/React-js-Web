import { ClipboardCheck, Download } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '../../components/common';
import type { CleaningText } from './types';

type CompletionNotesPanelProps = {
  allComplete: boolean;
  cleaningText: CleaningText;
  completionNotes: string;
  confirmed: boolean;
  sessionSummary: string;
  statusMessage: string;
  onConfirmSession: () => void;
  onCopySummary: () => void;
  onDownloadSummary: () => void;
  onExportWorkspace: () => void;
  onNotesChange: (value: string) => void;
};

export function CompletionNotesPanel({
  allComplete,
  cleaningText,
  completionNotes,
  confirmed,
  sessionSummary,
  statusMessage,
  onConfirmSession,
  onCopySummary,
  onDownloadSummary,
  onExportWorkspace,
  onNotesChange,
}: CompletionNotesPanelProps) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader title={cleaningText.completionNotesTitle} description={cleaningText.completionNotesDescription} />
      <CardContent className="space-y-4">
        <textarea
          value={completionNotes}
          onChange={(event) => onNotesChange(event.target.value)}
          className="form-input min-h-32 resize-none"
          placeholder={cleaningText.completionNotesPlaceholder}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <Button onClick={onConfirmSession} disabled={!allComplete} className="justify-center">
            {cleaningText.confirmCompletion}
          </Button>
          <Button variant="secondary" onClick={onCopySummary} className="justify-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            {cleaningText.copySummary}
          </Button>
          <Button variant="secondary" onClick={onDownloadSummary} className="justify-center gap-2">
            <Download className="h-4 w-4" />
            {cleaningText.downloadSummary}
          </Button>
          <Button variant="secondary" onClick={onExportWorkspace} className="justify-center gap-2">
            <Download className="h-4 w-4" />
            {cleaningText.exportWorkspace}
          </Button>
        </div>
        <p className={`break-words rounded-lg px-3 py-2 text-sm [overflow-wrap:anywhere] ${confirmed ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400'}`}>
          {statusMessage}
        </p>
        <pre className="max-h-52 overflow-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
          <code>{sessionSummary}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
