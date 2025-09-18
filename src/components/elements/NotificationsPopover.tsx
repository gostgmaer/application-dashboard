import React, { useState, useEffect, useRef } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'success' | 'info';
}

interface NotificationsPopoverProps {
  notifications: Notification[];
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ notifications }) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setVisible(v => !v)}
        className="p-2 rounded-lg transition-colors duration-200 relative text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15 17h5l-1.405-1.405M19 13V8a7 7 0 10-14 0v5l-1.405 1.405" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {visible && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border bg-white border-gray-200 z-50 dark:bg-gray-800 dark:border-gray-700 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          {notifications.map(n => (
            <div
              key={n.id}
              className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    n.type === 'warning' ? 'bg-yellow-500' :
                    n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{n.title}</p>
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{n.message}</p>
                  <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="p-4">
            <button
              onClick={() => setVisible(false)}
              className="w-full text-center text-sm font-medium py-2 rounded-lg transition-colors duration-200 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
