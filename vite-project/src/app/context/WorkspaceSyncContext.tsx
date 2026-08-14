import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { recordActivity } from '../services/activityService';
import { createNotification } from '../services/notificationService';
import {
  createUserWorkspaceVersion,
  fetchUserWorkspace,
  listUserWorkspaceVersions,
  saveUserWorkspace,
  subscribeUserWorkspace,
} from '../services/workspaceService';
import type { WorkspaceItems, WorkspaceSyncStatus, WorkspaceVersion } from '../types/workspace';
import {
  applyWorkspaceItems,
  collectWorkspaceItems,
  getWorkspaceFingerprint,
} from '../utils/workspaceBackup';

type WorkspaceSyncContextValue = {
  createVersion: (label?: string) => Promise<void>;
  errorMessage: string;
  items: WorkspaceItems;
  lastSyncedAt: Date | null;
  refreshVersions: () => Promise<void>;
  restoreVersion: (versionId: string) => Promise<void>;
  status: WorkspaceSyncStatus;
  statusMessage: string;
  syncNow: () => Promise<void>;
  versions: WorkspaceVersion[];
};

const deviceIdStorageKey = 'solucioneomos:device-id:v1';
const syncIntervalMs = 2500;

const WorkspaceSyncContext = createContext<WorkspaceSyncContextValue | undefined>(undefined);

function createDeviceId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getDeviceId() {
  try {
    const storedDeviceId = window.localStorage.getItem(deviceIdStorageKey);

    if (storedDeviceId) {
      return storedDeviceId;
    }

    const deviceId = createDeviceId();
    window.localStorage.setItem(deviceIdStorageKey, deviceId);
    return deviceId;
  } catch {
    return createDeviceId();
  }
}

function toDate(value: unknown) {
  if (value instanceof Date) {
    return value;
  }

  if (value && typeof value === 'object' && 'toDate' in value) {
    const toDateValue = (value as { toDate?: unknown }).toDate;

    if (typeof toDateValue === 'function') {
      return toDateValue.call(value) as Date;
    }
  }

  return null;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '워크스페이스 동기화 중 문제가 발생했습니다.';
}

function createVersionLabel() {
  return `수동 저장 ${new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date())}`;
}

export function WorkspaceSyncProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const deviceId = useMemo(getDeviceId, []);
  const lastSyncedFingerprintRef = useRef('');
  const syncInProgressRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [items, setItems] = useState<WorkspaceItems>({});
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [status, setStatus] = useState<WorkspaceSyncStatus>('signedOut');
  const [statusMessage, setStatusMessage] = useState('로그인하면 작업 데이터가 클라우드에 동기화됩니다.');
  const [versions, setVersions] = useState<WorkspaceVersion[]>([]);
  const userId = auth.user?.uid ?? null;

  const refreshVersions = useCallback(async () => {
    if (!userId) {
      setVersions([]);
      return;
    }

    setVersions(await listUserWorkspaceVersions(userId));
  }, [userId]);

  const synchronizeItems = useCallback(async (nextItems: WorkspaceItems, force = false) => {
    if (!userId || syncInProgressRef.current) {
      return false;
    }

    const fingerprint = getWorkspaceFingerprint(nextItems);

    if (!force && fingerprint === lastSyncedFingerprintRef.current) {
      return false;
    }

    syncInProgressRef.current = true;
    setErrorMessage('');
    setStatus('syncing');
    setStatusMessage('변경 내용을 클라우드에 저장하고 있습니다.');

    try {
      await saveUserWorkspace(userId, nextItems, fingerprint, deviceId);
      lastSyncedFingerprintRef.current = fingerprint;
      setItems(nextItems);
      setLastSyncedAt(new Date());
      setStatus('synced');
      setStatusMessage('이 기기의 작업 내용이 클라우드와 동기화되었습니다.');
      return true;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
      setStatusMessage('동기화하지 못한 변경 내용은 이 기기에 그대로 남아 있습니다.');
      return false;
    } finally {
      syncInProgressRef.current = false;
    }
  }, [deviceId, userId]);

  const syncNow = useCallback(async () => {
    if (!userId) {
      return;
    }

    await synchronizeItems(collectWorkspaceItems(), true);
  }, [synchronizeItems, userId]);

  const createVersion = useCallback(async (label?: string) => {
    if (!userId) {
      return;
    }

    const currentItems = collectWorkspaceItems();
    const fingerprint = getWorkspaceFingerprint(currentItems);

    setErrorMessage('');
    setStatus('syncing');
    setStatusMessage('현재 작업의 복구 지점을 만들고 있습니다.');

    try {
      await saveUserWorkspace(userId, currentItems, fingerprint, deviceId);
      await createUserWorkspaceVersion(
        userId,
        currentItems,
        fingerprint,
        label?.trim() || createVersionLabel(),
        'manual',
      );
      lastSyncedFingerprintRef.current = fingerprint;
      setItems(currentItems);
      setLastSyncedAt(new Date());
      setStatus('synced');
      setStatusMessage('현재 작업을 새 버전으로 저장했습니다.');
      if (auth.user) {
        void recordActivity({
          displayName: auth.user.displayName,
          email: auth.user.email,
          role: auth.role,
          uid: auth.user.uid,
        }, {
          action: 'workspace.version.created',
          summary: '워크스페이스 복구 버전을 저장했습니다.',
        }).catch((error) => console.warn('Failed to record workspace version activity.', error));
        void createNotification(auth.user.uid, {
          link: '/workspace',
          message: '현재 작업 내용을 복구 가능한 버전으로 저장했습니다.',
          title: '워크스페이스 버전 저장',
          type: 'success',
        }).catch((error) => console.warn('Failed to create workspace version notification.', error));
      }
      await refreshVersions();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
      setStatusMessage('버전을 만들지 못했습니다.');
    }
  }, [auth.role, auth.user, deviceId, refreshVersions, userId]);

  const restoreVersion = useCallback(async (versionId: string) => {
    if (!userId) {
      return;
    }

    const version = versions.find((item) => item.id === versionId);

    if (!version) {
      setErrorMessage('복원할 버전을 찾지 못했습니다.');
      return;
    }

    const currentItems = collectWorkspaceItems();
    const currentFingerprint = getWorkspaceFingerprint(currentItems);

    setErrorMessage('');
    setStatus('syncing');
    setStatusMessage('선택한 버전을 복원하고 있습니다.');

    try {
      await createUserWorkspaceVersion(
        userId,
        currentItems,
        currentFingerprint,
        `복원 전 백업: ${version.label}`,
        'restore-backup',
      );
      applyWorkspaceItems(version.items, true);
      await saveUserWorkspace(userId, version.items, version.fingerprint, deviceId);
      lastSyncedFingerprintRef.current = version.fingerprint;
      setItems(version.items);
      setLastSyncedAt(new Date());
      setStatus('synced');
      setStatusMessage(`'${version.label}' 버전을 복원했습니다. 도구를 다시 열면 복원된 내용이 표시됩니다.`);
      if (auth.user) {
        void recordActivity({
          displayName: auth.user.displayName,
          email: auth.user.email,
          role: auth.role,
          uid: auth.user.uid,
        }, {
          action: 'workspace.version.restored',
          summary: `'${version.label}' 워크스페이스 버전을 복원했습니다.`,
          targetId: version.id,
        }).catch((error) => console.warn('Failed to record workspace restore activity.', error));
        void createNotification(auth.user.uid, {
          link: '/workspace',
          message: `'${version.label}' 버전을 복원하고 기존 상태를 별도 백업했습니다.`,
          title: '워크스페이스 버전 복원',
          type: 'warning',
        }).catch((error) => console.warn('Failed to create workspace restore notification.', error));
      }
      await refreshVersions();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
      setStatusMessage('선택한 버전을 복원하지 못했습니다.');
    }
  }, [auth.role, auth.user, deviceId, refreshVersions, userId, versions]);

  useEffect(() => {
    if (!userId) {
      lastSyncedFingerprintRef.current = '';
      setErrorMessage('');
      setItems({});
      setLastSyncedAt(null);
      setStatus('signedOut');
      setStatusMessage('로그인하면 작업 데이터가 클라우드에 동기화됩니다.');
      setVersions([]);
      return undefined;
    }

    let isDisposed = false;
    let unsubscribe = () => {};

    const initializeWorkspace = async () => {
      setStatus('loading');
      setStatusMessage('이 기기와 클라우드의 작업 내용을 확인하고 있습니다.');
      setErrorMessage('');

      try {
        const localItems = collectWorkspaceItems();
        const remoteWorkspace = await fetchUserWorkspace(userId);
        const mergedItems = remoteWorkspace ? { ...remoteWorkspace.items, ...localItems } : localItems;
        const mergedFingerprint = getWorkspaceFingerprint(mergedItems);

        if (isDisposed) {
          return;
        }

        applyWorkspaceItems(mergedItems, true);

        if (!remoteWorkspace || remoteWorkspace.fingerprint !== mergedFingerprint) {
          await saveUserWorkspace(userId, mergedItems, mergedFingerprint, deviceId);
          setLastSyncedAt(new Date());
        } else {
          setLastSyncedAt(toDate(remoteWorkspace.updatedAt));
        }

        lastSyncedFingerprintRef.current = mergedFingerprint;
        setItems(mergedItems);
        setStatus('synced');
        setStatusMessage('이 기기의 작업 내용이 클라우드와 동기화되었습니다.');
        await refreshVersions();

        unsubscribe = subscribeUserWorkspace(
          userId,
          (remoteWorkspaceUpdate) => {
            if (
              isDisposed
              || !remoteWorkspaceUpdate
              || remoteWorkspaceUpdate.updatedByDeviceId === deviceId
              || remoteWorkspaceUpdate.fingerprint === lastSyncedFingerprintRef.current
            ) {
              return;
            }

            const localItemsUpdate = collectWorkspaceItems();
            const localFingerprint = getWorkspaceFingerprint(localItemsUpdate);

            if (localFingerprint !== lastSyncedFingerprintRef.current) {
              void synchronizeItems(localItemsUpdate);
              return;
            }

            applyWorkspaceItems(remoteWorkspaceUpdate.items, true);
            lastSyncedFingerprintRef.current = remoteWorkspaceUpdate.fingerprint;
            setItems(remoteWorkspaceUpdate.items);
            setLastSyncedAt(toDate(remoteWorkspaceUpdate.updatedAt));
            setStatus('synced');
            setStatusMessage('다른 기기에서 변경된 작업 내용을 이 기기에 반영했습니다.');
          },
          (error) => {
            if (!isDisposed) {
              setErrorMessage(getErrorMessage(error));
              setStatus('error');
            }
          },
        );
      } catch (error) {
        if (!isDisposed) {
          setErrorMessage(getErrorMessage(error));
          setStatus('error');
          setStatusMessage('클라우드 연결을 확인하지 못했습니다. 로컬 작업은 계속 사용할 수 있습니다.');
        }
      }
    };

    void initializeWorkspace();

    return () => {
      isDisposed = true;
      unsubscribe();
    };
  }, [deviceId, refreshVersions, synchronizeItems, userId]);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void synchronizeItems(collectWorkspaceItems());
    }, syncIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [synchronizeItems, userId]);

  const value = useMemo<WorkspaceSyncContextValue>(() => ({
    createVersion,
    errorMessage,
    items,
    lastSyncedAt,
    refreshVersions,
    restoreVersion,
    status,
    statusMessage,
    syncNow,
    versions,
  }), [
    createVersion,
    errorMessage,
    items,
    lastSyncedAt,
    refreshVersions,
    restoreVersion,
    status,
    statusMessage,
    syncNow,
    versions,
  ]);

  return <WorkspaceSyncContext.Provider value={value}>{children}</WorkspaceSyncContext.Provider>;
}

export function useWorkspaceSync() {
  const context = useContext(WorkspaceSyncContext);

  if (!context) {
    throw new Error('useWorkspaceSync must be used inside WorkspaceSyncProvider.');
  }

  return context;
}
