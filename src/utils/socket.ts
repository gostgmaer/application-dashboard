import { io, Socket } from 'socket.io-client';

interface Notification {
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

class NotificationClient {
  private socket: Socket;

  constructor(token: string) {

    console.log(process.env.NEXT_PUBLIC_APP_URL);

    this.socket = io(process.env.NEXT_PUBLIC_APP_URL as string, {
      auth: { token },
      withCredentials: false,
      query: { token },
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    this.setupListeners();
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to notification service');
    });

    this.socket.on('new_notification', (notification: Notification) => {
      this.showNotification(notification);
      this.updateNotificationCount();
    });

    this.socket.on('notification_updated', (data: { id: string; status: string; readAt: string }) => {
      this.updateNotificationInUI(data.id, data);
    });

    this.socket.on('all_notifications_read', (data: { updatedCount: number }) => {
      this.markAllNotificationsReadInUI();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification service');
    });
  }

  private showNotification(notification: Notification) {
    // toast.success(notification.title, {
    //   description: notification.message,
    //   duration: 5000,
    // });
    // Optionally also update your app UI for new notification
  }

  private updateNotificationCount() {
    // fetch or update the notification count badge in your UI
  }

  private updateNotificationInUI(notificationId: string, data: { status: string; readAt: string }) {
    // update the UI notification element based on read status or updates
  }

  private markAllNotificationsReadInUI() {
    // update your UI to mark all notifications as read
  }

  public markAsRead(notificationId: string) {
    this.socket.emit('mark_notification_read', notificationId);
  }

  public disconnect() {
    this.socket.disconnect();
  }
}

export default NotificationClient;
