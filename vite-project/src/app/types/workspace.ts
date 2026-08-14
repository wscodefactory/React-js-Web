export type WorkspaceItems = Record<string, string>;

export type WorkspaceSyncStatus = 'error' | 'loading' | 'signedOut' | 'synced' | 'syncing';

export type WorkspaceRecord = {
  fingerprint: string;
  itemCount: number;
  items: WorkspaceItems;
  updatedAt?: unknown;
  updatedByDeviceId: string;
};

export type WorkspaceVersionSource = 'manual' | 'restore-backup';

export type WorkspaceVersion = {
  createdAt?: unknown;
  fingerprint: string;
  id: string;
  itemCount: number;
  items: WorkspaceItems;
  label: string;
  source: WorkspaceVersionSource;
};
