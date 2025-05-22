import Message from "../models/Message.js";
import AdminReply from "../models/MessageAdmin.js";
import User from "../models/User.js";

const connectedUsers = new Map();

const messageHandlers = (io, socket) => {
  // On récupère les infos d'authentification
  const { userId, isAdmin } = socket.handshake.auth; 

  if (userId) {
    connectedUsers.set(userId, socket.id);
    console.log(`[Connexion] ${isAdmin ? 'Admin' : 'User'} ${userId}`);
  }

  // 🔄 Gestion historique des messages
  socket.on("request_history", async () => {
    try {
      if (isAdmin) {
        // Pour l'admin : afficher les messages des utilisateurs
        const messages = await Message.find({ deleted: false })
          .populate('userId', 'name', User)
          .sort({ timestamp: -1 });

        // On enrichit chaque message pour le front
        const enriched = messages.map(m => ({
          _id: m._id,
          userId: m.userId?._id?.toString() || "",
          userName: m.userId?.name || "Utilisateur inconnu",
          text: m.text,
          timestamp: m.timestamp,
          fromAdmin: false,
          replyTo: m.replyTo || null,
          toUserId: null
        }));

        socket.emit("message_history", enriched);
      } else {
        // Pour l'utilisateur : afficher les réponses admin qui le concernent
        const replies = await AdminReply.find({ 
          toUserId: userId, 
          deleted: false 
        }).sort({ timestamp: -1 });

        const enrichedReplies = replies.map(r => ({
          _id: r._id,
          userId: "admin",
          userName: "Admin",
          text: r.text,
          timestamp: r.timestamp,
          fromAdmin: true,
          replyTo: r.replyTo || null,
          toUserId: r.toUserId
        }));

        socket.emit("message_history", enrichedReplies);
      }
    } catch (err) {
      socket.emit("error", "Erreur historique");
    }
  });

  // ✉️ Gestion envoi de messages
  socket.on("send_message", async ({ text, replyTo, toUserId }) => {
    try {
      let newMessage;

      if (isAdmin) { // Réponse admin
        newMessage = new AdminReply({
          toUserId,
          text,
          replyTo,
          fromAdmin: true
        });

        const savedReply = await newMessage.save();

        // Payload conforme à MessageData pour le front
        const payload = {
          _id: savedReply._id,
          userId: "admin",
          userName: "Admin",
          text: savedReply.text,
          timestamp: savedReply.timestamp,
          fromAdmin: true,
          replyTo: savedReply.replyTo || null,
          toUserId: savedReply.toUserId
        };

        // Notifie l'utilisateur concerné
        const targetSocket = connectedUsers.get(toUserId);
        if (targetSocket) {
          io.to(targetSocket).emit("new_reply", payload);
        }
        // Notifie aussi l'admin (pour mise à jour dashboard)
        const adminSocket = connectedUsers.get('admin');
        if (adminSocket) {
          io.to(adminSocket).emit("new_reply", payload);
        }
      } else { 
        newMessage = new Message({
          userId,
          text,
          replyTo
        });

        const savedMessage = await newMessage.save();
        // On enrichit pour l'admin
        let userName = "Utilisateur";
        try {
          const user = await User.findById(userId);
          if (user) userName = user.name;
        } catch {}

        const payload = {
          _id: savedMessage._id,
          userId: savedMessage.userId?.toString() || "",
          userName,
          text: savedMessage.text,
          timestamp: savedMessage.timestamp,
          fromAdmin: false,
          replyTo: savedMessage.replyTo || null,
          toUserId: savedReply.toUserId
        };

        // Notifier l'admin
        const adminSocket = connectedUsers.get('admin');
        if (adminSocket) {
          io.to(adminSocket).emit("receive_message", payload);
        }
      }

 

    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(userId);
  });
};

export default messageHandlers;
