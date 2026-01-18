"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { WebSocketEvent } from "@/types";

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (event: WebSocketEvent) => void;
  addEventListener: (type: string, callback: (data: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}

const socketEnabled = process.env.NEXT_PUBLIC_SOCKETING_ENABLED === "true";

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  useEffect(() => {
    if (!socketEnabled) return;

    setIsConnected(true);

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const eventTypes = [
          "notification:new",
          "message:new",
          "typing:start",
          "call:incoming",
        ];

        const randomEvent =
          eventTypes[Math.floor(Math.random() * eventTypes.length)];

        listenersRef.current
          .get(randomEvent)
          ?.forEach((cb) => cb(generateMockData(randomEvent)));
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const sendMessage = (event: WebSocketEvent) => {
    if (!socketEnabled) return;
    console.log("Mock send:", event);
  };

  const addEventListener = (type: string, callback: (data: any) => void) => {
    if (!listenersRef.current.has(type)) {
      listenersRef.current.set(type, new Set());
    }

    listenersRef.current.get(type)!.add(callback);

    return () => {
      listenersRef.current.get(type)?.delete(callback);
    };
  };

  return (
    <WebSocketContext.Provider
      value={{ isConnected, sendMessage, addEventListener }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

function generateMockData(eventType: string) {
  switch (eventType) {
    case "notification:new":
      return {
        id: Date.now().toString(),
        type: ["info", "warning", "success"][Math.floor(Math.random() * 3)],
        priority: "medium",
        title: "New Notification",
        message: "You have received a new notification",
        read: false,
        createdAt: new Date(),
        userId: "user1",
      };
    case "message:new":
      return {
        id: Date.now().toString(),
        conversationId: "conv1",
        senderId: "user2",
        content: "Hello there! This is a real-time message.",
        type: "text",
        createdAt: new Date(),
        status: "sent",
      };
    case "typing:start":
      return {
        conversationId: "conv1",
        userId: "user2",
        userName: "John Doe",
      };
    case "call:incoming":
      return {
        id: Date.now().toString(),
        conversationId: "conv1",
        initiatorId: "user2",
        participants: [
          {
            id: "user2",
            name: "John Doe",
            email: "john@example.com",
            online: true,
          },
          { id: "user1", name: "You", email: "you@example.com", online: true },
        ],
        type: Math.random() > 0.5 ? "video" : "audio",
        status: "ringing",
        startedAt: new Date(),
        teamsUrl: "https://teams.microsoft.com/l/meetup-join/...",
      };
    default:
      return {};
  }
}
