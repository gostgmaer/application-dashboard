"use client";
import React, { useState, useEffect, useRef } from 'react';
import NotificationClient, { Notification } from '../../utils/socket';
import { formatDistanceToNow } from "date-fns";
interface NotificationsPopoverProps {
  token: string;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ token }) => {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const clientRef = React.useRef<NotificationClient | null>(null);

  useEffect(() => {
    // Initialize notification client once with token and callbacks for updates
    const client = new NotificationClient(token, {
      onNew: (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((count) => count + 1);
      },
      onUpdate: (id, status) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, metadata: { ...n.metadata, status } } : n))
        );
        if (status === 'read') setUnreadCount((count) => Math.max(count - 1, 0));
      },
      onReadAll: () => setUnreadCount(0),
    });
    clientRef.current = client;

    // Cleanup on unmount
    return () => client.disconnect();
  }, [token]);

  useEffect(() => {
    // Close popover if clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleVisible = () => setVisible((v) => !v);

  const markAsRead = (id: string) => {
    clientRef.current?.markAsRead(id);
  };

  const markAllRead = () => {
    clientRef.current?.markAllRead();
    setUnreadCount(0);
  };

  // const timeAgoString = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : "No timestamp available";

  return (
    <div ref={containerRef} className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={toggleVisible}
        aria-label="Notifications"
        className="p-2 rounded-lg relative text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 rounded-full bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown List */}
      {visible && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                onClick={markAllRead}
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 && (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</p>
          )}

          <ul>
            {notifications.map((n) => {
              const isRead = n.metadata?.status === 'read';
              return (
                <li
                  key={n.id}
                  className={`px-4 py-2 border-b border-gray-200 dark:border-gray-700 ${
                    isRead ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-200">{n.title}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{n.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
             
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!isRead && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Optional link to view all notifications page */}
          <div className="text-center py-2">
            <a
              href="/notifications"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              onClick={() => setVisible(false)}
            >
              View All Notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
