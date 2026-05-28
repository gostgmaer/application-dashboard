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

    // TODO: Connect to real WebSocket server
    // const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
    // ws.onmessage = (event) => { ... };

    return () => {
      setIsConnected(false);
    };
  }, []);

  const sendMessage = (event: WebSocketEvent) => {
    if (!socketEnabled) return;
    // TODO: Send via real WebSocket connection
    console.log("WebSocket send:", event);
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

