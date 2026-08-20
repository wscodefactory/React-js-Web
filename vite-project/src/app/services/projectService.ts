import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  projectAccentColors,
  type PersonalProject,
  type ProjectAccentColor,
  type ProjectDraft,
  type ProjectStatus,
} from '../types/project';

const projectRootCollection = 'userProjects';
const projectItemCollection = 'items';

function requireDb() {
  if (!db) {
    throw new Error('Firestore 환경변수가 설정되지 않았습니다.');
  }

  return db;
}

function getProjectCollection(userId: string) {
  return collection(requireDb(), projectRootCollection, userId, projectItemCollection);
}

function getProjectDocument(userId: string, projectId: string) {
  return doc(requireDb(), projectRootCollection, userId, projectItemCollection, projectId);
}

function normalizeStringList(value: unknown, maxCount: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((item): item is string => typeof item === 'string'))].slice(0, maxCount);
}

function normalizeAccentColor(value: unknown): ProjectAccentColor {
  return projectAccentColors.includes(value as ProjectAccentColor) ? value as ProjectAccentColor : 'green';
}

function normalizeProject(projectId: string, data: Record<string, unknown>): PersonalProject {
  return {
    accentColor: normalizeAccentColor(data.accentColor),
    createdAt: data.createdAt,
    description: typeof data.description === 'string' ? data.description : '',
    id: projectId,
    isFavorite: data.isFavorite === true,
    linkedStorageKeys: normalizeStringList(data.linkedStorageKeys, 50),
    name: typeof data.name === 'string' ? data.name : '이름 없는 프로젝트',
    status: data.status === 'archived' ? 'archived' : 'active',
    tags: normalizeStringList(data.tags, 5),
    updatedAt: data.updatedAt,
  };
}

export function subscribeUserProjects(
  userId: string,
  onProjects: (projects: PersonalProject[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(getProjectCollection(userId), orderBy('updatedAt', 'desc')),
    (snapshot) => onProjects(snapshot.docs.map((projectDoc) => normalizeProject(projectDoc.id, projectDoc.data()))),
    (error) => onError(error),
  );
}

export async function createUserProject(userId: string, draft: ProjectDraft) {
  const projectRef = await addDoc(getProjectCollection(userId), {
    ...draft,
    createdAt: serverTimestamp(),
    isFavorite: false,
    status: 'active',
    updatedAt: serverTimestamp(),
    userId,
  });

  return projectRef.id;
}

export async function updateUserProject(userId: string, projectId: string, draft: ProjectDraft) {
  await updateDoc(getProjectDocument(userId, projectId), {
    ...draft,
    updatedAt: serverTimestamp(),
  });
}

export async function duplicateUserProject(userId: string, project: PersonalProject) {
  return createUserProject(userId, {
    accentColor: project.accentColor,
    description: project.description,
    linkedStorageKeys: project.linkedStorageKeys,
    name: `${project.name} 복사본`,
    tags: project.tags,
  });
}

export async function setUserProjectFavorite(userId: string, projectId: string, isFavorite: boolean) {
  await updateDoc(getProjectDocument(userId, projectId), {
    isFavorite,
    updatedAt: serverTimestamp(),
  });
}

export async function setUserProjectStatus(userId: string, projectId: string, status: ProjectStatus) {
  await updateDoc(getProjectDocument(userId, projectId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserProject(userId: string, projectId: string) {
  await deleteDoc(getProjectDocument(userId, projectId));
}
