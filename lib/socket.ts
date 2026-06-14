import { io, Socket } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://178.62.40.106:8000";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ["websocket"],
      autoConnect: false, // Avoid connecting until user is authenticated
    });

    socket.on("connect", () => {
      console.log("[Socket.IO] Connected to backend real-time server");
    });

    socket.on("disconnect", () => {
      console.log("[Socket.IO] Disconnected from backend real-time server");
    });
  }
  return socket;
};
