import { io } from "socket.io-client";

// const socket = io("http://localhost:8000", {
const socket = io("https://chat-app-6h3y.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
