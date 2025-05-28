import cron from "node-cron";
import Notification from "../models/Notification.js";

// Delete notifs 5Days
const initializeCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      const result = await Notification.deleteMany({ timestamp: { $lt: fiveDaysAgo } });
      console.log(`✅ Cron run: ${result.deletedCount} notifications supprimées`);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression des notifications :", error);
    }
  });
};

export default initializeCronJobs;

