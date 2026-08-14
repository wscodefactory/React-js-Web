export const workspaceStoragePrefix = 'web5:';
export const workspaceRestoredEvent = 'web5:workspace-restored';

type WorkspaceBackupPayload = {
  exportedAt: string;
  items: Record<string, string>;
  version: 1;
};

export function exportWorkspaceBackup() {
  const items = collectWorkspaceItems();

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

export function collectWorkspaceItems() {
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

  return items;
}

export function getWorkspaceFingerprint(items: Record<string, string>) {
  const serializedItems = JSON.stringify(Object.fromEntries(Object.entries(items).sort(([firstKey], [secondKey]) => (
    firstKey.localeCompare(secondKey)
  ))));
  let hash = 2166136261;

  for (let index = 0; index < serializedItems.length; index += 1) {
    hash ^= serializedItems.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function getWorkspaceByteSize(items: Record<string, string>) {
  return new Blob(Object.entries(items).flatMap(([key, value]) => [key, value])).size;
}

export function applyWorkspaceItems(items: Record<string, string>, replaceExisting = true) {
  if (replaceExisting) {
    for (const key of Object.keys(collectWorkspaceItems())) {
      window.localStorage.removeItem(key);
    }
  }

  let appliedCount = 0;

  for (const [key, value] of Object.entries(items)) {
    if (key.startsWith(workspaceStoragePrefix) && typeof value === 'string') {
      window.localStorage.setItem(key, value);
      appliedCount += 1;
    }
  }

  window.dispatchEvent(new CustomEvent(workspaceRestoredEvent, { detail: { appliedCount } }));

  return appliedCount;
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

  return applyWorkspaceItems(payload.items, false);
}
