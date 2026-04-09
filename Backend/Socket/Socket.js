import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

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

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(cookieParser()));
const userSocketMap = {}; 

export const getSocketIdRicevente = (IdRicevente) => {
  return userSocketMap[IdRicevente];
};

io.on("connection", (socket) => {
  try {
      const token = socket.request.cookies.jwt;
        
      if (!token) {
                    console.log("Connessione Socket rifiutata: Token mancante");
                    return socket.disconnect();
            }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.UserId;
      if (userId) {
                    userSocketMap[userId] = socket.id;
                    console.log(`Utente ${userId} connesso via Socket (Verificato)`);
            }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
} catch (error) {
    console.error("Errore autenticazione Socket:", error.message);
    socket.disconnect();
  }
});

export { app, io, server };
