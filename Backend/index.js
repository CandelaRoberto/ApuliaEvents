import express from "express"
import dotenv from "dotenv";
import connectDB from "./Database/MongoDB.js";
import userRoutes from "./Routes/User_route.js";
import postRoutes from "./Routes/post_route.js";
import messRoutes from "./Routes/Messaggi_route.js";
import notRouter from "./Routes/Notifiche_route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"; 
import { fileURLToPath } from "url";
import {app, server} from "./Socket/Socket.js"

dotenv.config();
const PORT=process.env.PORT||5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: "https://apuliaeventsbackend.onrender.com", 
  credentials: true 
}));

app.use(express.json())
app.use(cookieParser())


app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/messaggi', messRoutes);
app.use('/api/notifiche', notRouter);


app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});


server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server attivo sulla porta ${PORT}`);

});


