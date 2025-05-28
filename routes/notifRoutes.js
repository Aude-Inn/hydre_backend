import express from 'express';
import { getNotifications } from "../controllers/notifController.js";

const router = express.Router();

// Get Notifs
router.get("/", getNotifications);

export default router;