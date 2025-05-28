import Notification from '../models/Notification.js';

// Get Notif
export const getNotifications = async (req, res) => {
  try {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    const notifications = await Notification.find({ timestamp: { $gte: fiveDaysAgo } })
      .sort({ timestamp: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    res.status(500).json({ message: "Échec de la récupération des notifications" });
  }
};