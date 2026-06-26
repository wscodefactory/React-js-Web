import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Code2, Copy, Download } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { copyTextToClipboard } from '../../utils/clipboard';
import { chromeExtensionText } from './data';
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
  const { language } = useLanguage();
  const text = chromeExtensionText[language].fileList;
  const [selectedPath, setSelectedPath] = useState(files[0]?.path ?? '');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(text.selectFile);

  useEffect(() => {
    setStatus(text.selectFile);
  }, [text.selectFile]);

  const selectedFile = useMemo(() => {
    return files.find((file) => file.path === selectedPath) ?? files[0];
  }, [files, selectedPath]);

  const copyFile = async (file: ExtensionScaffoldFile) => {
    const copied = await copyTextToClipboard(file.content);

    if (!copied) {
      setCopiedPath(null);
      setStatus(text.copyBlocked);
      return;
    }

    setCopiedPath(file.path);
    setStatus(text.copied(file.path));
    window.setTimeout(() => setCopiedPath(null), 1200);
  };

  const downloadFile = (file: ExtensionScaffoldFile) => {
    downloadTextFile(file);
    setStatus(text.fileReady(file.path));
  };

  const downloadAllFiles = () => {
    if (files.length === 0) {
      setStatus(text.noFiles);
      return;
    }

    const fileName = `${slugify(bundleName)}.zip`;

    downloadBlob(createZipBlob(files), fileName);
    setStatus(text.bundleReady(files.length, fileName));
  };

  return (
    <Card className="min-w-0 max-w-[calc(100vw_-_2rem)] overflow-hidden md:max-w-full">
      <CardContent className="min-w-0 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-gray-900 dark:text-white">{text.title}</h2>
            <p className="break-words text-sm text-gray-500 [overflow-wrap:anywhere] dark:text-gray-400">{text.description}</p>
          </div>
          <Button variant="secondary" onClick={downloadAllFiles} className="w-fit gap-2">
            <Download className="h-4 w-4" />
            {text.downloadAll}
          </Button>
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="min-w-0 space-y-2">
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
            <div className="min-w-0 max-w-full space-y-3">
              <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words font-medium text-gray-900 [overflow-wrap:anywhere] dark:text-white">{selectedFile.path}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedFile.language}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => copyFile(selectedFile)} className="gap-2">
                    {copiedPath === selectedFile.path ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedPath === selectedFile.path ? text.copiedButton : text.copy}
                  </Button>
                  <Button variant="secondary" onClick={() => downloadFile(selectedFile)} className="gap-2">
                    <Download className="h-4 w-4" />
                    {text.file}
                  </Button>
                </div>
              </div>
              <pre className="max-h-80 max-w-full overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          ) : null}
        </div>

        <p className="break-words rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 [overflow-wrap:anywhere] dark:bg-gray-900 dark:text-gray-400">{status}</p>
      </CardContent>
    </Card>
  );
}
