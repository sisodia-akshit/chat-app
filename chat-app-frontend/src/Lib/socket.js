import { io } from "socket.io-client";
let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(
      "https://chat-app-6h3y.onrender.com",
      // "http://localhost:8000",
      {
        transports: ["websocket"],
        withCredentials: true,
      },
    );
  }
  return socket;
};

export const getSocket = () => socket;
