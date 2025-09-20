// src/context/NotificationContext.tsx
"use client"
import NotificationClient from '@/utils/socket';
import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';

interface NotificationContextType {
  notificationClient: NotificationClient | null;
}

const NotificationContext = createContext<NotificationContextType>({
  notificationClient: null,
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
  authToken: string;
}

export function NotificationProvider({ children, authToken }: NotificationProviderProps) {
  const notificationClientRef = useRef<NotificationClient | null>(null);

  useEffect(() => {
    if (authToken) {
      notificationClientRef.current = new NotificationClient(authToken);
    }

    return () => {
      notificationClientRef.current?.disconnect();
      notificationClientRef.current = null;
    };
  }, [authToken]);

  return (
    <NotificationContext.Provider value={{ notificationClient: notificationClientRef.current }}>
      {children}
    </NotificationContext.Provider>
  );
}
