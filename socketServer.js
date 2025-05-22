import { Server } from "socket.io";
import messageHandlers from "./socketHandlers/messageHandlers.js";

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

 
  io.use((socket, next) => {
    const userId = socket.handshake.query.userId;
    const isAdmin = socket.handshake.query.isAdmin === "true";
    if (!userId) {
      return next(new Error("userId manquant"));
    }
    socket.userId = userId;
    socket.isAdmin = isAdmin;
    next();
  });

  io.on("connection", (socket) => {
    
    messageHandlers(io, socket);
  });

  return io;
};

export default socketServer;


