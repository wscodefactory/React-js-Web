import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  notificationTypes,
  type AppNotification,
  type NotificationType,
} from '../types/notification';

type NotificationInput = {
  link?: string | null;
  message: string;
  title: string;
  type?: NotificationType;
};

function requireDb() {
  if (!db) {
    throw new Error('Firestore 환경변수가 설정되지 않았습니다.');
  }

  return db;
}

function isNotificationType(value: unknown): value is NotificationType {
  return typeof value === 'string' && notificationTypes.includes(value as NotificationType);
}

function getNotificationCollection(userId: string) {
  return collection(requireDb(), 'notifications', userId, 'items');
}

export async function createNotification(userId: string, input: NotificationInput) {
  await addDoc(getNotificationCollection(userId), {
    createdAt: serverTimestamp(),
    link: input.link ?? null,
    message: input.message,
    readAt: null,
    title: input.title,
    type: input.type ?? 'info',
    userId,
  });
}

export function subscribeNotifications(
  userId: string,
  onNotifications: (notifications: AppNotification[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(getNotificationCollection(userId), orderBy('createdAt', 'desc'), limit(30)),
    (snapshot) => {
      onNotifications(snapshot.docs.map((notificationDoc) => {
        const data = notificationDoc.data();

        return {
          createdAt: data.createdAt,
          id: notificationDoc.id,
          link: typeof data.link === 'string' ? data.link : null,
          message: typeof data.message === 'string' ? data.message : '새 알림이 도착했습니다.',
          readAt: data.readAt,
          title: typeof data.title === 'string' ? data.title : '알림',
          type: isNotificationType(data.type) ? data.type : 'info',
          userId,
        };
      }));
    },
    (error) => onError(error),
  );
}

export async function markNotificationRead(userId: string, notificationId: string) {
  await updateDoc(doc(requireDb(), 'notifications', userId, 'items', notificationId), {
    readAt: serverTimestamp(),
  });
}

export async function markAllNotificationsRead(userId: string, notificationIds: string[]) {
  if (notificationIds.length === 0) {
    return;
  }

  const batch = writeBatch(requireDb());

  for (const notificationId of notificationIds) {
    batch.update(doc(requireDb(), 'notifications', userId, 'items', notificationId), {
      readAt: serverTimestamp(),
    });
  }

  await batch.commit();
}
