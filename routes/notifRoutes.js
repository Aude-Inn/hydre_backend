import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// Récupérer les notif
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 }); 
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    res.status(500).json({ message: "Échec de la récupération des notifications" });
  }
});

export default router;