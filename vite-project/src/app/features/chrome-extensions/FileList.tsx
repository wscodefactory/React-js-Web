import { useMemo, useState } from 'react';
import { CheckCircle, Code2, Copy, Download } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { copyTextToClipboard } from '../../utils/clipboard';
import type { ExtensionScaffoldFile } from './scaffold';
import { createZipBlob } from './zipBundle';

type FileListProps = {
  bundleName: string;
  files: ExtensionScaffoldFile[];
};

function downloadTextFile(file: ExtensionScaffoldFile) {
  const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = file.path.split('/').pop() ?? file.path;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'extension-scaffold';
}

export function FileList({ bundleName, files }: FileListProps) {
  const [selectedPath, setSelectedPath] = useState(files[0]?.path ?? '');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [status, setStatus] = useState('Select a generated file to inspect or copy.');

  const selectedFile = useMemo(() => {
    return files.find((file) => file.path === selectedPath) ?? files[0];
  }, [files, selectedPath]);

  const copyFile = async (file: ExtensionScaffoldFile) => {
    const copied = await copyTextToClipboard(file.content);

    if (!copied) {
      setCopiedPath(null);
      setStatus('Clipboard copy failed. Use download instead.');
      return;
    }

    setCopiedPath(file.path);
    setStatus(`${file.path} copied to clipboard.`);
    window.setTimeout(() => setCopiedPath(null), 1200);
  };

  const downloadFile = (file: ExtensionScaffoldFile) => {
    downloadTextFile(file);
    setStatus(`${file.path} queued for download.`);
  };

  const downloadAllFiles = () => {
    if (files.length === 0) {
      setStatus('No scaffold files are available to bundle.');
      return;
    }

    downloadBlob(createZipBlob(files), `${slugify(bundleName)}.zip`);
    setStatus(`${files.length} scaffold files bundled into ${slugify(bundleName)}.zip.`);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generated scaffold</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Copy a single file or download the extension scaffold as a ZIP bundle.</p>
          </div>
          <Button variant="secondary" onClick={downloadAllFiles} className="w-fit gap-2">
            <Download className="h-4 w-4" />
            Download all
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="space-y-2">
            {files.map((file) => {
              const selected = selectedFile?.path === file.path;

              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedPath(file.path)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                    selected
                      ? 'bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/30 dark:text-green-300 dark:ring-green-900'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Code2 className="h-4 w-4 shrink-0 text-green-600" />
                  <span className="min-w-0 truncate">{file.path}</span>
                </button>
              );
            })}
          </div>

          {selectedFile ? (
            <div className="min-w-0 space-y-3">
              <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedFile.path}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedFile.language}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => copyFile(selectedFile)} className="gap-2">
                    {copiedPath === selectedFile.path ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedPath === selectedFile.path ? 'Copied' : 'Copy'}
                  </Button>
                  <Button variant="secondary" onClick={() => downloadFile(selectedFile)} className="gap-2">
                    <Download className="h-4 w-4" />
                    File
                  </Button>
                </div>
              </div>
              <pre className="max-h-80 overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          ) : null}
        </div>

        <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{status}</p>
      </CardContent>
    </Card>
  );
}
