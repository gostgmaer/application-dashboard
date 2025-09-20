'use client';

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import NotificationClient from '../utils/socket'; // adjust path
import { useSession } from 'next-auth/react';  // or your auth method

interface NotificationContextType {
  notificationClient: NotificationClient | null;
}

const NotificationContext = createContext<NotificationContextType>({
  notificationClient: null,
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const notificationClientRef = useRef<NotificationClient | null>(null);
  const { data: session } = useSession(); // example with next-auth

  useEffect(() => {
    if (session?.user?.accessToken) {
      console.log('Initializing NotificationClient with token:', session.user.accessToken);
      
      notificationClientRef.current = new NotificationClient(session.user.accessToken);
    }

    return () => {
      notificationClientRef.current?.disconnect();
      notificationClientRef.current = null;
    };
  }, [session?.user?.accessToken]);

  return (
    <NotificationContext.Provider value={{ notificationClient: notificationClientRef.current }}>
      {children}
    </NotificationContext.Provider>
  );
}
