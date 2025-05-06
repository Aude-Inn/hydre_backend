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
app.use(authRoutes);
app.use(gameRoutes);
app.use(userRoutes);
app.use(messRoutes);
app.use(notifRoutes);


const io = socketServer(server);
app.set("io", io); 

// Démarrage 
const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur http://localhost:${PORT}`);
});
