import express from "express"
import dotenv from "dotenv";
import connectDB from "./Database/MongoDB.js";
import userRoutes from "./Routes/User_route.js";
import postRoutes from "./Routes/post_route.js";
import messRoutes from "./Routes/Messaggi_route.js";
import notRouter from "./Routes/Notifiche_route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server} from "./Socket/Socket.js"

dotenv.config();
const PORT=process.env.PORT||5001;

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true 
}));;
app.use(express.json())
app.use(cookieParser())


app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/messaggi', messRoutes);
app.use('/api/notifiche', notRouter);


server.listen(PORT, ()=>{
    connectDB();
    console.log(`Sever attivo sulla porta ${PORT}`);
});