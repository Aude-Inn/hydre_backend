import Message from "../models/Message.js";
import User from "../models/User.js";

const messageHandlers = (io, socket) => {
  console.log("[Server] Nouvelle connexion socket:", socket.id);

    socket.on("request_history", async () => {
    console.log("[Server] Historique demandé");
    try {
      const messages = await Message.find().sort({ timestamp: 1 });
      const userIds = [...new Set(messages.map((msg) => msg.userId))];
      const validUserIds = userIds.filter(id => mongoose.Types.ObjectId.isValid(id));
      const users = await User.find({ _id: { $in: validUserIds } });

      const userMap = new Map(users.map((user) => [user._id.toString(), user.name]));

      const enrichedMessages = messages.map((msg) => ({
        ...msg.toObject(),
        userName: userMap.get(msg.userId) || (msg.userId === "admin" ? "Admin" : "Utilisateur inconnu"),
      }));

      console.log("[Server] Envoi de l'historique :", enrichedMessages.length, "messages");

      socket.emit("message_history", enrichedMessages);
    } catch (error) {
      console.error("[Server] Erreur historique :", error);
      socket.emit("error_message", { error: "Erreur lors du chargement de l'historique" });
    }
  });

  socket.on("send_message", async (data) => {
    console.log("[Server] Message reçu :", data);

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

      const messageToSend = {
        _id: savedMessage._id,
        userId: savedMessage.userId,
        userName,
        text: savedMessage.text,
        timestamp: savedMessage.timestamp,
      };

      console.log("[Server] Broadcast du message :", messageToSend);

      io.emit("receive_message", messageToSend);
    } catch (error) {
      console.error("[Server] Erreur lors de l'envoi :", error);
      socket.emit("error_message", { error: "Erreur serveur lors de la sauvegarde" });
    }
  });

  socket.on("disconnect", () => {
    console.log("[Server] Déconnexion socket:", socket.id);
  });
};

export default messageHandlers;