import cron from "node-cron";
import Notification from "../models/Notification.js";

const initializeCronJobs = () => {
  
  cron.schedule("0 0 * * *", async () => {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      await Notification.deleteMany({ addedAt: { $lt: oneWeekAgo } });
    } catch (error) {
      
    }
  });
};

export default initializeCronJobs;
