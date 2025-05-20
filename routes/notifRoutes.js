import express from 'express';
import { getNotifications } from "../controllers/notifController.js";

const router = express.Router();

// Récupérer les notif
router.get("/", getNotifications);

export default router;