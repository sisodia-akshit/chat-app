import { io } from "socket.io-client";
let socket = null;
const api = "https://chat-app-6h3y.onrender.com"
// const api = "http://localhost:8000";

export const connectSocket = () => {
  if (socket && socket?.connected === false) {
    socket = io(api, {
      transports: ["websocket"],
      withCredentials: true,
    });
  }
  if (!socket) {
    socket = io(api, {
      transports: ["websocket"],
      withCredentials: true,
    });
  }
  return socket;
};

export const getSocket = () => socket;
