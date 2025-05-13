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

  io.on("connection", (socket) => {
    messageHandlers(io, socket);
  });

  return io;
};

export default socketServer;
