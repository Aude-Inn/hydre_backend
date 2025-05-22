// routes/messages.js
import express from 'express';
import Message from "../models/Message.js";
import AdminReply from "../models/MessageAdmin.js";

const router = express.Router();

// Supprimer un message (soft delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let message = await Message.findById(id);
    if (message) {
      message.deleted = true;
      await message.save();
      return res.sendStatus(204);
    }

    let reply = await AdminReply.findById(id);
    if (reply) {
      reply.deleted = true;
      await reply.save();
      return res.sendStatus(204);
    }

    res.status(404).json({ error: "Message introuvable" });
  } catch (error) {
    console.error("[DELETE /messages/:id] Erreur :", error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

export default router;