export const notificationTypes = ['info', 'success', 'warning', 'role'] as const;

export type NotificationType = (typeof notificationTypes)[number];

export type AppNotification = {
  createdAt?: unknown;
  id: string;
  link: string | null;
  message: string;
  readAt?: unknown;
  title: string;
  type: NotificationType;
  userId: string;
};
