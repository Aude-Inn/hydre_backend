import express from 'express';
import { deleteMessage } from '../controllers/messController.js';

const router = express.Router();

// Delete Mess
router.delete('/:id', deleteMessage);

export default router;