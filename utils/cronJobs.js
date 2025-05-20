import cron from "node-cron";
import Notification from "../models/Notification.js";

// Delete notif 5j
const initializeCronJobs = () => {
  cron.schedule("0 0 * * *", async () => { 
    try {
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      await Notification.deleteMany({ addedAt: { $lt: fiveDaysAgo } });
    } catch (error) {
      console.error("Erreur lors de la suppression des notifications :", error);
    }
  });
};

export default initializeCronJobs;

