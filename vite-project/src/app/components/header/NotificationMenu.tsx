import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Bell, CheckCheck, CircleAlert, ShieldCheck, Sparkles } from 'lucide-react';
import { IconButton } from '../common';
import { useNotifications } from '../../context/NotificationContext';
import type { AppNotification } from '../../types/notification';

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

function formatNotificationTime(value: unknown) {
  const date = toDate(value);

  if (!date) {
    return '방금 전';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function NotificationIcon({ notification }: { notification: AppNotification }) {
  if (notification.type === 'role') {
    return <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
  }

  if (notification.type === 'warning') {
    return <CircleAlert className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
  }

  return <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />;
}

export function NotificationMenu() {
  const location = useLocation();
  const notifications = useNotifications();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const notificationContent = (notification: AppNotification) => (
    <>
      <span className="mt-0.5 shrink-0"><NotificationIcon notification={notification} /></span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="font-semibold text-gray-950 dark:text-white">{notification.title}</span>
          {!notification.readAt ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" /> : null}
        </span>
        <span className="mt-1 block text-xs leading-5 text-gray-600 dark:text-gray-300">{notification.message}</span>
        <span className="mt-1 block text-[11px] text-gray-400">{formatNotificationTime(notification.createdAt)}</span>
      </span>
    </>
  );

  return (
    <div ref={menuRef} className="relative">
      <div className="relative">
        <IconButton
          icon={<Bell className="icon" />}
          label={`알림 ${notifications.unreadCount}개`}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          className="header-theme-toggle"
        />
        {notifications.unreadCount > 0 ? (
          <span className="pointer-events-none absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
            {notifications.unreadCount > 99 ? '99+' : notifications.unreadCount}
          </span>
        ) : null}
      </div>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-1rem))] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <div>
              <h2 className="text-sm font-semibold text-gray-950 dark:text-white">알림</h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">확인하지 않은 알림 {notifications.unreadCount}개</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline disabled:text-gray-400 dark:text-green-400"
              disabled={notifications.unreadCount === 0}
              onClick={() => void notifications.markAllRead()}
            >
              <CheckCheck className="h-4 w-4" />
              모두 읽음
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.errorMessage ? (
              <p className="px-4 py-5 text-sm text-red-600 dark:text-red-300">알림을 불러오지 못했습니다.</p>
            ) : notifications.isLoading ? (
              <p className="px-4 py-5 text-sm text-gray-600 dark:text-gray-300">알림을 불러오고 있습니다.</p>
            ) : notifications.notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto h-7 w-7 text-gray-300 dark:text-gray-600" />
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">새 알림이 없습니다.</p>
              </div>
            ) : notifications.notifications.map((notification) => {
              const className = `flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 ${notification.readAt ? '' : 'bg-green-50/50 dark:bg-green-950/10'}`;
              const handleClick = () => {
                if (!notification.readAt) {
                  void notifications.markRead(notification.id);
                }
              };

              return notification.link ? (
                <Link key={notification.id} to={notification.link} className={className} onClick={handleClick}>
                  {notificationContent(notification)}
                </Link>
              ) : (
                <button key={notification.id} type="button" className={className} onClick={handleClick}>
                  {notificationContent(notification)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
