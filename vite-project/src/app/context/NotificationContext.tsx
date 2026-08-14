import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  markAllNotificationsRead,
  markNotificationRead,
  subscribeNotifications,
} from '../services/notificationService';
import type { AppNotification } from '../types/notification';

type NotificationContextValue = {
  errorMessage: string;
  isLoading: boolean;
  markAllRead: () => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  notifications: AppNotification[];
  unreadCount: number;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const userId = auth.user?.uid ?? null;

  useEffect(() => {
    if (!userId) {
      setErrorMessage('');
      setIsLoading(false);
      setNotifications([]);
      return undefined;
    }

    setIsLoading(true);
    setErrorMessage('');

    return subscribeNotifications(
      userId,
      (nextNotifications) => {
        setNotifications(nextNotifications);
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      },
    );
  }, [userId]);

  const markRead = useCallback(async (notificationId: string) => {
    if (!userId) {
      return;
    }

    await markNotificationRead(userId, notificationId);
  }, [userId]);

  const markAllRead = useCallback(async () => {
    if (!userId) {
      return;
    }

    await markAllNotificationsRead(
      userId,
      notifications.filter((notification) => !notification.readAt).map((notification) => notification.id),
    );
  }, [notifications, userId]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.readAt).length,
    [notifications],
  );

  const value = useMemo<NotificationContextValue>(() => ({
    errorMessage,
    isLoading,
    markAllRead,
    markRead,
    notifications,
    unreadCount,
  }), [errorMessage, isLoading, markAllRead, markRead, notifications, unreadCount]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used inside NotificationProvider.');
  }

  return context;
}
