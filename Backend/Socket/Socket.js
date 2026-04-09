import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors({
   origin: "https://apuliaeventsbackend.onrender.com", 
  credentials: true,
}    
));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://apuliaeventsbackend.onrender.com",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

const userSocketMap = {}; 

export const getSocketIdRicevente = (IdRicevente) => {
  return userSocketMap[IdRicevente];
};

io.on("connection", (socket) => {

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export { app, io, server };

