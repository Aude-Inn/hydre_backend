import cron from "node-cron";
import Notification from "../models/Notification.js";

const initializeCronJobs = () => {
  // Supprimer les notifications plus vieilles que 7 jours chaque jour à minuit
  cron.schedule("0 0 * * *", async () => {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      await Notification.deleteMany({ addedAt: { $lt: oneWeekAgo } });
    } catch (error) {
      // Logger uniquement en développement ou vers un système de log (Sentry, Loggly, etc.)
    }
  });
};

export default initializeCronJobs;
