import Message from "../models/Message.js";
import User from "../models/User.js";

const connectedUsers = new Map();

const messageHandlers = (io, socket) => {
  const userId = socket.handshake.auth.userId;
  if (userId) connectedUsers.set(userId, socket.id);

  // Historique des messages (admin)
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

  // Inbox perso d'un utilisateur
  socket.on("request_inbox", async (userId) => {
    try {
      const messages = await Message.find({ toUserId: userId }).sort({ timestamp: -1 });
      socket.emit("inbox_messages", messages);
    } catch (error) {
      socket.emit("error_message", { error: "Erreur lors du chargement de l'inbox" });
    }
  });

  // Message utilisateur
  socket.on("send_message", async (data) => {
    const { userId, text, toUserId } = data;

    if (!userId || typeof userId !== "string" || !text || typeof text !== "string") {
      return socket.emit("error_message", { error: "Données invalides" });
    }

    try {
      const newMessage = new Message({
        userId,
        text,
        toUserId: toUserId || null,
        timestamp: new Date(),
      });

      const savedMessage = await newMessage.save();
      const user = await User.findById(userId);
      const userName = user ? user.name : "Utilisateur inconnu";

      const messagePayload = {
        _id: savedMessage._id,
        userId: savedMessage.userId,
        userName,
        text: savedMessage.text,
        timestamp: savedMessage.timestamp,
        toUserId: savedMessage.toUserId || null,
      };

      if (toUserId && connectedUsers.has(toUserId)) {
        io.to(connectedUsers.get(toUserId)).emit("receive_message", messagePayload);
      } else {
        io.emit("receive_message", messagePayload);
      }
    } catch (error) {
      socket.emit("error_message", { error: "Erreur serveur lors de la sauvegarde" });
    }
  });

  // 🔧 Message admin (réponse)
  socket.on("admin_reply", async ({ userId, text, replyTo }) => {
  console.log("[admin_reply] Reçu:", { userId, text, replyTo });

  try {
    const newMessage = new Message({
      userId: "admin",
      text,
      toUserId: userId,
      replyTo: replyTo || null,
      timestamp: new Date(),
    });

    const savedMessage = await newMessage.save();

    const messagePayload = {
      _id: savedMessage._id,
      userId: "admin",
      userName: "Admin",
      text: savedMessage.text,
      timestamp: savedMessage.timestamp,
      toUserId: userId,
    };

    console.log("[admin_reply] Message sauvegardé:", messagePayload);

    if (connectedUsers.has(userId)) {
      const targetSocketId = connectedUsers.get(userId);
      console.log(`[admin_reply] Envoi du message à l'utilisateur connecté (${userId}) via socket ${targetSocketId}`);
      io.to(targetSocketId).emit("receive_message", messagePayload);
    } else {
      console.warn(`[admin_reply] Utilisateur ${userId} non connecté. Message non envoyé.`);
    }
  } catch (error) {
    console.error("[admin_reply] Erreur :", error);
    socket.emit("error_message", { error: "Échec de l'envoi du message admin" });
  }
});

  // Déconnexion
  socket.on("disconnect", () => {
    if (userId) connectedUsers.delete(userId);
  });
};

export default messageHandlers;
