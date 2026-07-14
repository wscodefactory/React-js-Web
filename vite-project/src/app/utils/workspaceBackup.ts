const workspaceStoragePrefix = 'web5:';

type WorkspaceBackupPayload = {
  exportedAt: string;
  items: Record<string, string>;
  version: 1;
};

export function exportWorkspaceBackup() {
  const items: Record<string, string> = {};

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (key?.startsWith(workspaceStoragePrefix)) {
      const value = window.localStorage.getItem(key);

      if (value !== null) {
        items[key] = value;
      }
    }
  }

  const payload: WorkspaceBackupPayload = {
    exportedAt: new Date().toISOString(),
    items,
    version: 1,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'solucioneomos-workspace-backup.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

function isWorkspaceBackupPayload(value: unknown): value is WorkspaceBackupPayload {
  return (
    Boolean(value)
    && typeof value === 'object'
    && (value as WorkspaceBackupPayload).version === 1
    && typeof (value as WorkspaceBackupPayload).items === 'object'
    && Boolean((value as WorkspaceBackupPayload).items)
  );
}

export async function importWorkspaceBackup(file: File) {
  const payload = JSON.parse(await file.text()) as unknown;

  if (!isWorkspaceBackupPayload(payload)) {
    throw new Error('Invalid workspace backup file.');
  }

  for (const [key, value] of Object.entries(payload.items)) {
    if (key.startsWith(workspaceStoragePrefix) && typeof value === 'string') {
      window.localStorage.setItem(key, value);
    }
  }

  return Object.keys(payload.items).length;
}
