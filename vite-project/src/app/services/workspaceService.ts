import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  WorkspaceItems,
  WorkspaceRecord,
  WorkspaceVersion,
  WorkspaceVersionSource,
} from '../types/workspace';

const workspaceCollection = 'userWorkspaces';
const versionCollection = 'versions';

function requireDb() {
  if (!db) {
    throw new Error('Firestore 환경변수가 설정되지 않았습니다.');
  }

  return db;
}

function normalizeItems(value: unknown): WorkspaceItems {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([key, itemValue]) => key.startsWith('web5:') && typeof itemValue === 'string'),
  );
}

function normalizeWorkspaceRecord(data: Record<string, unknown>): WorkspaceRecord {
  const items = normalizeItems(data.items);

  return {
    fingerprint: typeof data.fingerprint === 'string' ? data.fingerprint : '',
    itemCount: Object.keys(items).length,
    items,
    updatedAt: data.updatedAt,
    updatedByDeviceId: typeof data.updatedByDeviceId === 'string' ? data.updatedByDeviceId : '',
  };
}

export async function fetchUserWorkspace(userId: string): Promise<WorkspaceRecord | null> {
  const snapshot = await getDoc(doc(requireDb(), workspaceCollection, userId));

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeWorkspaceRecord(snapshot.data());
}

export async function saveUserWorkspace(
  userId: string,
  items: WorkspaceItems,
  fingerprint: string,
  deviceId: string,
) {
  await setDoc(doc(requireDb(), workspaceCollection, userId), {
    fingerprint,
    itemCount: Object.keys(items).length,
    items,
    updatedAt: serverTimestamp(),
    updatedByDeviceId: deviceId,
    userId,
  });
}

export function subscribeUserWorkspace(
  userId: string,
  onWorkspace: (workspace: WorkspaceRecord | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(requireDb(), workspaceCollection, userId),
    (snapshot) => {
      onWorkspace(snapshot.exists() ? normalizeWorkspaceRecord(snapshot.data()) : null);
    },
    (error) => onError(error),
  );
}

export async function createUserWorkspaceVersion(
  userId: string,
  items: WorkspaceItems,
  fingerprint: string,
  label: string,
  source: WorkspaceVersionSource,
) {
  const versionRef = await addDoc(collection(requireDb(), workspaceCollection, userId, versionCollection), {
    createdAt: serverTimestamp(),
    fingerprint,
    itemCount: Object.keys(items).length,
    items,
    label,
    source,
    userId,
  });

  return versionRef.id;
}

export async function listUserWorkspaceVersions(userId: string, maxCount = 20): Promise<WorkspaceVersion[]> {
  const snapshot = await getDocs(query(
    collection(requireDb(), workspaceCollection, userId, versionCollection),
    orderBy('createdAt', 'desc'),
    limit(maxCount),
  ));

  return snapshot.docs.map((versionDoc) => {
    const data = versionDoc.data();
    const items = normalizeItems(data.items);

    return {
      createdAt: data.createdAt,
      fingerprint: typeof data.fingerprint === 'string' ? data.fingerprint : '',
      id: versionDoc.id,
      itemCount: Object.keys(items).length,
      items,
      label: typeof data.label === 'string' ? data.label : '이름 없는 버전',
      source: data.source === 'restore-backup' ? 'restore-backup' : 'manual',
    };
  });
}
