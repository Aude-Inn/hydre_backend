import Message from "../models/Message.js";
import User from "../models/User.js";

const messageHandlers = (io, socket) => {
  // Historique des messages
  socket.on("request_history", async () => {
    try {
      const messages = await Message.find().sort({ timestamp: 1 });
      const userIds = [...new Set(messages.map((msg) => msg.userId))];
      const users = await User.find({ _id: { $in: userIds } });

      const userMap = new Map(users.map((user) => [user._id.toString(), user.name]));

      const enrichedMessages = messages.map((msg) => ({
        ...msg.toObject(),
        userName: userMap.get(msg.userId) || "Utilisateur inconnu",
      }));

      socket.emit("message_history", enrichedMessages);
    } catch (error) {
      socket.emit("error_message", { error: "Erreur lors du chargement de l'historique" });
    }
  });

  // Envoi de message
  socket.on("send_message", async (data) => {
    if (
      !data.userId || typeof data.userId !== "string" ||
      !data.text || typeof data.text !== "string"
    ) {
      return socket.emit("error_message", { error: "Données invalides" });
    }

    try {
      const newMessage = new Message({
        userId: data.userId,
        text: data.text,
        timestamp: new Date(),
      });

      const savedMessage = await newMessage.save();
      const user = await User.findById(data.userId);
      const userName = user ? user.name : "Utilisateur inconnu";

      io.emit("receive_message", {
        _id: savedMessage._id,
        userId: savedMessage.userId,
        userName,
        text: savedMessage.text,
        timestamp: savedMessage.timestamp,
      });
    } catch (error) {
      socket.emit("error_message", { error: "Erreur serveur lors de la sauvegarde" });
    }
  });

  // Déconnexion
  socket.on("disconnect", () => {
  
  });
};

export default messageHandlers;

