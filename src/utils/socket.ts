// import { appUrl } from '@/config/setting';
import { appUrl } from '@/config/setting';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  data?: Record<string, any>;
  createdAt: string;
  sender?: {
    username?: string;
    email?: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}
export interface NotificationClientOptions {
  onNew?: (notif: Notification) => void;
  onUpdate?: (id: string, status: string, readAt: string) => void;
  onReadAll?: (updatedCount: number) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

class NotificationClient {
  private socket: Socket;
  private notifications: Notification[] = [];
  private unreadCount = 0;
  private opts: NotificationClientOptions;

  constructor(token: string, options: NotificationClientOptions = {}) {
    this.opts = options;

    this.socket = io(appUrl as string, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      withCredentials: false,
      query: { token },
    });

    this.setupListeners();
  }


  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to notification service');
      this.opts.onConnect?.();
    });

    this.socket.on('new_notification', (notification: Notification) => {
      this.showNotification(notification);
      this.updateNotificationCount(1);
      this.opts.onNew?.(notification);
    });

    this.socket.on(
      'notification_updated',
      (data: { id: string; status: string; readAt: string }) => {
        this.updateNotificationInUI(data.id, data.status, data.readAt);
        this.opts.onUpdate?.(data.id, data.status, data.readAt);
      }
    );

    this.socket.on(
      'all_notifications_read',
      (data: { updatedCount: number }) => {
        this.markAllNotificationsReadInUI();
        this.opts.onReadAll?.(data.updatedCount);
      }
    );

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification service');
      this.opts.onDisconnect?.();
    });
  }


  private showNotification(notification: Notification) {
    // Add to local list at front
    this.notifications.unshift(notification);
    // Optionally trigger a UI toast if you want
    // e.g. toast.success(notification.title, { description: notification.message });
  }

  private updateNotificationCount(delta: number) {
    this.unreadCount += delta;
    if (this.unreadCount < 0) this.unreadCount = 0;
    // e.g. update a badge in your React state
  }

  private updateNotificationInUI(
    id: string,
    status: string,
    readAt: string
  ) {
    const idx = this.notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      // @ts-ignore
      this.notifications[idx].metadata = {
        ...this.notifications[idx].metadata,
        status,
        readAt,
      };
      if (status === 'READ') {
        this.updateNotificationCount(-1);
      }
    }
  }

  private markAllNotificationsReadInUI() {
    this.notifications = this.notifications.map((n) => ({
      ...n,
      metadata: { ...n.metadata, status: 'READ', readAt: new Date().toISOString() },
    }));
    this.unreadCount = 0;
  }

  public markAsRead(notificationId: string) {
    this.socket.emit('mark_notification_read', { id: notificationId });
    // Optimistically update UI
    this.updateNotificationInUI(notificationId, 'READ', new Date().toISOString());
  }

  public markAllRead() {
    this.socket.emit('mark_all_read');
    // Optimistic UI update
    this.markAllNotificationsReadInUI();
  }

  public getAllNotifications(): Notification[] {
    return this.notifications;
  }

  public getUnreadCount(): number {
    return this.unreadCount;
  }

  public disconnect() {
    this.socket.disconnect();
  }
}

export default NotificationClient;
