import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors({
   origin: "https://apulia-events.vercel.app", 
  credentials: true,
}    
));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://apulia-events.vercel.app",
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

  socket.on("send_message", ({ receiverId, message }) => {
    const receiverSocketId = getSocketIdRicevente(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("nuovoMessaggio", message);
    }
  });

  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export { app, io, server };

