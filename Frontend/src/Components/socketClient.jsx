import { io } from "socket.io-client";

let socket = null;

export function getSocket(userId) {
  if (!socket) {
    socket = io("https://apuliaevents.onrender.com", {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket"],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
