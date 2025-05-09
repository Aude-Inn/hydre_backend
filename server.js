import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import initializeCronJobs from "./utils/cronJobs.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messRoutes from "./routes/messRoutes.js";
import notifRoutes from "./routes/notifRoutes.js";

import corsMiddleware from "./middleware/corsMiddleware.js";

import { createServer } from "http";
import socketServer from "./socketServer.js";

dotenv.config();
connectDB(); 
initializeCronJobs(); 

const app = express();
const server = createServer(app);

// Middlewares 
app.use(express.json());
app.use(corsMiddleware);

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/messages", messRoutes);
app.use("/api/notifs", notifRoutes);
app.use("/api/users", userRoutes);



const io = socketServer(server);
app.set("io", io); 

// Démarrage 
const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur http://localhost:${PORT}`);
});
