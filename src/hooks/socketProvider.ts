'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock socket implementation for demonstration
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
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
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
      if (Math.random() > 0.95) { // 5% chance every second
        const mockEmail = {
          id: Date.now().toString(),
          sender: `user${Math.floor(Math.random() * 100)}@company.com`,
          subject: 'New incoming email',
          preview: 'This is a simulated incoming email for real-time demonstration.',
          content: 'This is the full content of a simulated incoming email to demonstrate real-time socket integration.',
          timestamp: new Date(),
          isRead: false,
          isStarred: false,
          isSent: false,
          isDraft: false,
          isArchived: false,
          isSpam: false,
          attachments: [],
          labels: ['new']
        };

        this.listeners['new-email']?.forEach(callback => callback(mockEmail));
      }
    }, 1000);
  }
}

interface SocketContextType {
  socket: MockSocket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<MockSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}