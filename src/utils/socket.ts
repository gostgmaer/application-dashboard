import { io, Socket } from "socket.io-client";

const SOCKET_URL: string =
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://your-external-socket-url.com";

// Define events you expect (example: "message")
interface ServerToClientEvents {
  message: (msg: string) => void;
}

interface ClientToServerEvents {
  message: (msg: string) => void;
}

// Strongly typed socket instance
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  SOCKET_URL,
  {
    transports: ["websocket"],
    autoConnect: false, // we control connection manually
  }
);
