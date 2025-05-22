import Message from "../models/Message.js";
import AdminReply from "../models/Messrep.js";
import User from "../models/User.js";

const connectedUsers = new Map();

const messageHandlers = (io, socket) => {
  const userId = socket.handshake.userId;
  if (userId) connectedUsers.set(userId, socket.id);

  // 🔹 Historique : côté utilisateur ou admin
  socket.on("request_history", async () => {
    try {
      if (userId === "admin") {
        // ADMIN : voit les messages des utilisateurs
        const messages = await Message.find({ deleted: false }).sort({ timestamp: 1 });

        const userIds = [...new Set(messages.map((m) => m.userId))];
        const users = await User.find({ _id: { $in: userIds } });
        const userMap = new Map(users.map((u) => [u._id.toString(), u.name]));

        const enriched = messages.map((m) => ({
          ...m.toObject(),
          userName: userMap.get(m.userId) || "Utilisateur inconnu",
        }));

        socket.emit("message_history", enriched);
      } else {
        // UTILISATEUR : ne voit que les réponses de l’admin
        const replies = await AdminReply.find({ toUserId: userId, deleted: false }).sort({ timestamp: 1 });

        socket.emit("message_history", replies);
      }
    } catch (err) {
      socket.emit("error_message", { error: "Erreur lors de l'historique" });
    }
  });

  // 🔹 Envoi de message
  socket.on("send_message", async (data) => {
    const { text, toUserId } = data;

    if (!userId || !text) {
      return socket.emit("error_message", { error: "Données invalides" });
    }

    try {
      let saved, payload;

      if (userId === "admin" && toUserId) {
        // ADMIN répond à un utilisateur
        const AdminMessage = new AdminReply({
          toUserId,
          text,
        });

        saved = await AdminMessage.save();

        payload = {
          ...saved.toObject(),
          userName: "Admin",
        };

        if (connectedUsers.has(toUserId)) {
          io.to(connectedUsers.get(toUserId)).emit("receive_message", payload);
        }
      } else {
        // UTILISATEUR envoie un message
        const UserMsg = new Message({
          userId,
          text,
        });

        saved = await UserMsg.save();

        payload = {
          ...saved.toObject(),
          userName: "Utilisateur",
        };

        if (connectedUsers.has("admin")) {
          io.to(connectedUsers.get("admin")).emit("receive_message", payload);
        }
      }

      // Toujours renvoyer au sender
      socket.emit("receive_message", payload);
    } catch (err) {
      console.error("[send_message] Erreur :", err);
      socket.emit("error_message", { error: "Erreur lors de l'envoi" });
    }
  });

  // 🔌 Déconnexion
  socket.on("disconnect", () => {
    connectedUsers.delete(userId);
    console.log(`[Déconnexion] Utilisateur ${userId}`);
  });
};

export default messageHandlers;