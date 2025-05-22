import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.delete('/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Échec suppression' });
  }
});

export default router;