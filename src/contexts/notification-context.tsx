'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Notification } from '@/types';
import { useWebSocket } from './websocket-context';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
  fetchNotifications: () => void;
  addNotification: (notificationData: Omit<Notification, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProviderCommunication({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addEventListener } = useWebSocket();

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notification updates
    const unsubscribe = addEventListener('notification:new', (data: Notification) => {
      setNotifications(prev => [data, ...prev]);
    });

    return unsubscribe;
  }, [addEventListener]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/notifications', {
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // const notifications = await response.json();
      // setNotifications(notifications);
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          priority: 'high',
          title: 'Welcome to the platform!',
          message: 'Your account has been successfully created and verified.',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          actionUrl: '/profile',
          actionLabel: 'View Profile',
          userId: 'user1'
        },
        {
          id: '2',
          type: 'info',
          priority: 'medium',
          title: 'New feature available',
          message: 'Check out our new messaging system with real-time updates.',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60),
          actionUrl: '/features',
          actionLabel: 'Learn More',
          userId: 'user1'
        },
        {
          id: '3',
          type: 'warning',
          priority: 'high',
          title: 'Security Alert',
          message: 'We detected a new login from an unknown device.',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          actionUrl: '/security',
          actionLabel: 'Review',
          userId: 'user1'
        },
        {
          id: '4',
          type: 'promo',
          priority: 'low',
          title: 'Special Offer',
          message: 'Get 50% off on premium features for the next 7 days!',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          actionUrl: '/upgrade',
          actionLabel: 'Upgrade Now',
          userId: 'user1'
        },
        {
          id: '5',
          type: 'error',
          priority: 'urgent',
          title: 'Payment Failed',
          message: 'Your recent payment could not be processed. Please update your payment method.',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          actionUrl: '/billing',
          actionLabel: 'Update Payment',
          userId: 'user1'
        }
      ];

      setNotifications(mockNotifications);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    // TODO: Replace with your actual API endpoint
    // fetch(`/api/notifications/${id}/read`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // });
    
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    // TODO: Replace with your actual API endpoint
    // fetch('/api/notifications/mark-all-read', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // });
    
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    // TODO: Replace with your actual API endpoint
    // fetch(`/api/notifications/${id}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // });
    
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const deleteAllNotifications = () => {
    // TODO: Replace with your actual API endpoint
    // fetch('/api/notifications', {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // });
    
    setNotifications([]);
  };

  const addNotification = (notificationData: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        fetchNotifications,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}