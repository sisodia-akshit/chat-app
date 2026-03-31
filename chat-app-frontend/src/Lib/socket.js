import { io } from "socket.io-client";

const socket = io(
  // "https://chat-app-6h3y.onrender.com",
  "http://localhost:8000",
  {
    transports: ["websocket"],
    withCredentials: true,
  },
);

export default socket;
