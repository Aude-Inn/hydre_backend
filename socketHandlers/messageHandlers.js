import Message from "../models/Message.js";
import User from "../models/User.js";

const connectedUsers = new Map();

const messageHandlers = (io, socket) => {
  const userId = socket.handshake.userId;
  if (userId) connectedUsers.set(userId, socket.id);

  // historiq
  socket.on("request_history", async () => {
    try {
      const messages = await Message.find().sort({ timestamp: 1 });
      const userIds = [...new Set(messages.map((msg) => msg.userId))];
      const users = await User.find({ _id: { $in: userIds } });

      const userMap = new Map(users.map((user) => [user._id.toString(), user.name]));

      const enrichedMessages = messages.map((msg) => ({
        ...msg.toObject(),
        userName: userMap.get(msg.userId) || (msg.userId === "admin" ? "Admin" : "Utilisateur inconnu"),
      }));

      socket.emit("message_history", enrichedMessages);
    } catch (error) {
      socket.emit("error_message", { error: "Erreur lors du chargement de l'historique" });
    }
  });

  // box user 
  socket.on("request_inbox", async (userId) => {
    try {
      const messages = await Message.find({ toUserId: userId }).sort({ timestamp: -1 });
      socket.emit("inbox_messages", messages);
    } catch (error) {
      socket.emit("error_message", { error: "Erreur lors du chargement de l'inbox" });
    }
  });

  // user msg
  socket.on("send_message", async (data) => {
    const { userId, userName, text, toUserId } = data;

    if (!userId || typeof userId !== "string" || !text || typeof text !== "string") {
      return socket.emit("error_message", { error: "Données invalides" });
    }

    try {
      const newMessage = new Message({
        userId,
        text,
        toUserId: toUserId || null,
      });

      const savedMessage = await newMessage.save();

      let finalUserName = userName;
      if (!finalUserName) {
        const user = await User.findById(userId);
        finalUserName = user ? user.name : "Utilisateur inconnu";
      }

      const messagePayload = {
        _id: savedMessage._id,
        userId: savedMessage.userId,
        userName: finalUserName,
        text: savedMessage.text,
        timestamp: savedMessage.timestamp,
        toUserId: savedMessage.toUserId,
      };

      if (toUserId && connectedUsers.has(toUserId)) {
        io.to(connectedUsers.get(toUserId)).emit("receive_message", messagePayload);
      } else {
        io.emit("receive_message", messagePayload);
      }
    } catch (error) {
      console.error("[Server] Erreur send_message:", error);
      socket.emit("error_message", { error: "Erreur serveur lors de la sauvegarde" });
    }
  });

  // admin Msg
  socket.on("admin_reply", async ({ userId, text, replyTo }) => {
    if (!userId || !text) {
      return socket.emit("error_message", { error: "Données de réponse invalides" });
    }

    try {
      const newMessage = new Message({
        userId: "admin",
        toUserId: userId,
        text,
        replyTo: replyTo || null,
        timestamp: new Date(),
      });

      await newMessage.save();

      const replyPayload = {
        ...newMessage.toObject(),
        userName: "Admin",
        fromAdmin: true,
      };

      const targetSocketId = connectedUsers.get(userId);
      if (targetSocketId) {
        io.to(targetSocketId).emit("receive_message", replyPayload);
      }

     
      socket.emit("receive_message", replyPayload);
    } catch (error) {
      console.error("[Server] Erreur admin_reply:", error);
      socket.emit("error_message", { error: "Erreur lors de l'envoi de la réponse" });
    }
  });

  // Déco
socket.on("disconnect", () => {
  connectedUsers.delete(userId);
  console.log(`[Socket] Utilisateur déconnecté: ${userId}`);
})}

export default messageHandlers;
