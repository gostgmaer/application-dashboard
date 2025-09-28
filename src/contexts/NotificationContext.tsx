// src/context/NotificationContext.tsx
"use client";
import NotificationClient from "@/utils/socket";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  useState,
} from "react";

interface NotificationContextType {
  notificationClient: NotificationClient | null;
  socket: MockSocket | null;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType>({
  notificationClient: null,
  socket: null,
  isConnected: false,
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
}
class MockSocket {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback?: Function) {
    if (!this.listeners[event]) return;
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    } else {
      delete this.listeners[event];
    }
  }

  emit(event: string, data?: any) {
    console.log(`Socket event emitted: ${event}`, data);
    // In a real implementation, this would send data to the server
  }

  // Simulate receiving messages
  simulateIncoming() {
    setInterval(() => {
      if (Math.random() > 0.95) {
        // 5% chance every second
        const mockEmail = {
          id: Date.now().toString(),
          sender: `user${Math.floor(Math.random() * 100)}@company.com`,
          subject: "New incoming email",
          preview:
            "This is a simulated incoming email for real-time demonstration.",
          content:
            "This is the full content of a simulated incoming email to demonstrate real-time socket integration.",
          timestamp: new Date(),
          isRead: false,
          isStarred: false,
          isSent: false,
          isDraft: false,
          isArchived: false,
          isSpam: false,
          attachments: [],
          labels: ["new"],
        };

        this.listeners["new-email"]?.forEach((callback) => callback(mockEmail));
      }
    }, 1000);
  }
}

interface SocketContextType {
  socket: MockSocket | null;
  isConnected: boolean;
}

export function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const notificationClientRef = useRef<NotificationClient | null>(null);
  const [socket, setSocket] = useState<MockSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    // Initialize mock socket
    const mockSocket = new MockSocket();
    setSocket(mockSocket);
    setIsConnected(true);

    // Start simulating incoming emails
    mockSocket.simulateIncoming();

    return () => {
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  useEffect(() => {
    if (session?.accessToken) {
      notificationClientRef.current = new NotificationClient(session?.accessToken);
    }

    return () => {
      notificationClientRef.current?.disconnect();
      notificationClientRef.current = null;
    };
  }, [session?.accessToken]);

  return (
    <NotificationContext.Provider
      value={{
        notificationClient: notificationClientRef.current,
        socket,
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useSocket() {
  return useContext(NotificationContext);
}
