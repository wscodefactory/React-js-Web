import { useMemo, useState } from 'react';
import { Cloud, DatabaseBackup, HardDrive, History, RefreshCw, RotateCcw, Save } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, Input } from '../components/common';
import { useWorkspaceSync } from '../context/WorkspaceSyncContext';
import { getWorkspaceByteSize } from '../utils/workspaceBackup';
import { getWorkspaceItemLabel } from '../utils/workspaceLabels';

function formatBytes(byteSize: number) {
  if (byteSize < 1024) {
    return `${byteSize} B`;
  }

  if (byteSize < 1024 * 1024) {
    return `${(byteSize / 1024).toFixed(1)} KB`;
  }

  return `${(byteSize / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: Date | unknown) {
  let date: Date | null = value instanceof Date ? value : null;

  if (!date && value && typeof value === 'object' && 'toDate' in value) {
    const toDateValue = (value as { toDate?: unknown }).toDate;

    if (typeof toDateValue === 'function') {
      date = toDateValue.call(value) as Date;
    }
  }

  if (!date) {
    return '기록 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

const statusLabels = {
  error: '확인 필요',
  loading: '불러오는 중',
  signedOut: '로그인 필요',
  synced: '동기화 완료',
  syncing: '동기화 중',
} as const;

export function WorkspacePage() {
  const workspace = useWorkspaceSync();
  const [versionLabel, setVersionLabel] = useState('');
  const sortedItems = useMemo(() => Object.entries(workspace.items).sort(([firstKey], [secondKey]) => (
    firstKey.localeCompare(secondKey)
  )), [workspace.items]);
  const totalByteSize = useMemo(() => getWorkspaceByteSize(workspace.items), [workspace.items]);
  const isBusy = workspace.status === 'loading' || workspace.status === 'syncing';

  const handleCreateVersion = async () => {
    await workspace.createVersion(versionLabel);
    setVersionLabel('');
  };

  const handleRestoreVersion = async (versionId: string, label: string) => {
    const shouldRestore = window.confirm(`'${label}' 버전으로 복원할까요? 현재 상태는 복원 전 백업으로 저장됩니다.`);

    if (shouldRestore) {
      await workspace.restoreVersion(versionId);
    }
  };

  return (
    <div className="container-page space-y-6">
      <section className="border-b border-gray-200 pb-6 dark:border-gray-700">
        <p className="text-sm font-semibold text-green-600 dark:text-green-400">Workspace</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-950 dark:text-white">내 워크스페이스</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              도구에서 저장한 작업을 계정에 동기화하고 다른 기기에서 이어서 사용합니다.
            </p>
          </div>
          <Button type="button" onClick={() => void workspace.syncNow()} disabled={isBusy}>
            <RefreshCw className={`mr-2 inline h-4 w-4 ${workspace.status === 'syncing' ? 'animate-spin' : ''}`} />
            지금 동기화
          </Button>
        </div>
      </section>

      {workspace.errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
          {workspace.errorMessage}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader title="동기화 상태" description={statusLabels[workspace.status]} icon={<Cloud className="h-5 w-5 text-green-600" />} />
        </Card>
        <Card>
          <CardHeader title="저장 항목" description={`${sortedItems.length}개`} icon={<HardDrive className="h-5 w-5 text-green-600" />} />
        </Card>
        <Card>
          <CardHeader title="마지막 동기화" description={formatDate(workspace.lastSyncedAt)} icon={<DatabaseBackup className="h-5 w-5 text-green-600" />} />
        </Card>
      </div>

      <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-100">
        {workspace.statusMessage}
      </p>

      <Card>
        <CardHeader
          title="현재 작업 데이터"
          description={`총 ${formatBytes(totalByteSize)} · 로그인 중에는 변경 사항을 자동으로 감지합니다.`}
          icon={<HardDrive className="h-5 w-5 text-green-600" />}
        />
        <CardContent className="border-t border-gray-100 dark:border-gray-800">
          {sortedItems.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-600 dark:text-gray-300">
              아직 저장된 작업이 없습니다. 도구에서 작업을 저장하면 이곳에 표시됩니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th className="py-3 pr-4">작업</th>
                    <th className="py-3 pr-4">저장 키</th>
                    <th className="py-3 text-right">크기</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map(([storageKey, value]) => (
                    <tr key={storageKey} className="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
                      <td className="py-3 pr-4 font-semibold text-gray-950 dark:text-white">{getWorkspaceItemLabel(storageKey)}</td>
                      <td className="max-w-[360px] truncate py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{storageKey}</td>
                      <td className="py-3 text-right text-gray-600 dark:text-gray-300">{formatBytes(new Blob([value]).size)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="버전 기록"
          description="중요한 시점에 복구 지점을 만들고 필요한 버전으로 되돌립니다."
          icon={<History className="h-5 w-5 text-green-600" />}
        />
        <CardContent className="space-y-5 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              aria-label="버전 이름"
              onChange={(event) => setVersionLabel(event.target.value)}
              placeholder="버전 이름 (선택)"
              value={versionLabel}
            />
            <Button type="button" className="shrink-0" onClick={() => void handleCreateVersion()} disabled={isBusy}>
              <Save className="mr-2 inline h-4 w-4" />
              현재 버전 저장
            </Button>
          </div>

          {workspace.versions.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-600 dark:text-gray-300">저장된 버전이 없습니다.</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {workspace.versions.map((version) => (
                <div key={version.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-950 dark:text-white">{version.label}</h3>
                      {version.source === 'restore-backup' ? <span className="badge">복원 전 백업</span> : null}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(version.createdAt)} · {version.itemCount}개 항목
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="shrink-0"
                    disabled={isBusy}
                    onClick={() => void handleRestoreVersion(version.id, version.label)}
                  >
                    <RotateCcw className="mr-2 inline h-4 w-4" />
                    복원
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
