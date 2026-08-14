import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import {
  activityActions,
  type ActivityAction,
  type ActivityLog,
} from '../types/activity';
import { isUserRole, type UserRole } from '../types/auth';

type ActivityActor = {
  displayName: string | null;
  email: string | null;
  role: UserRole;
  uid: string;
};

type ActivityInput = {
  action: ActivityAction;
  details?: string | null;
  summary: string;
  targetId?: string | null;
};

function requireDb() {
  if (!db) {
    throw new Error('Firestore 환경변수가 설정되지 않았습니다.');
  }

  return db;
}

function isActivityAction(value: unknown): value is ActivityAction {
  return typeof value === 'string' && activityActions.includes(value as ActivityAction);
}

export async function recordActivity(actor: ActivityActor, input: ActivityInput) {
  await addDoc(collection(requireDb(), 'activityLogs'), {
    action: input.action,
    actorDisplayName: actor.displayName,
    actorEmail: actor.email,
    actorRole: actor.role,
    actorUid: actor.uid,
    createdAt: serverTimestamp(),
    details: input.details ?? null,
    summary: input.summary,
    targetId: input.targetId ?? null,
  });
}

export async function listActivityLogs(maxCount = 200): Promise<ActivityLog[]> {
  const snapshot = await getDocs(query(
    collection(requireDb(), 'activityLogs'),
    orderBy('createdAt', 'desc'),
    limit(maxCount),
  ));

  return snapshot.docs.flatMap((activityDoc) => {
    const data = activityDoc.data();

    if (!isActivityAction(data.action)) {
      return [];
    }

    return [{
      action: data.action,
      actorDisplayName: typeof data.actorDisplayName === 'string' ? data.actorDisplayName : null,
      actorEmail: typeof data.actorEmail === 'string' ? data.actorEmail : null,
      actorRole: isUserRole(data.actorRole) ? data.actorRole : 'user',
      actorUid: typeof data.actorUid === 'string' ? data.actorUid : '',
      createdAt: data.createdAt,
      details: typeof data.details === 'string' ? data.details : null,
      id: activityDoc.id,
      summary: typeof data.summary === 'string' ? data.summary : '활동 기록',
      targetId: typeof data.targetId === 'string' ? data.targetId : null,
    }];
  });
}
