import express from "express";
import {
  createGame,
  getGame,
  getAllGames,
  updateGame,
  deleteGame,
} from "../controllers/gameController.js";

const router = express.Router();

router.post("/games", createGame); // Créer
router.get("/games", getAllGames); // Obtient tous
router.get("/games/:id", getGame); // un jeu par ID
router.put("/games/:id", updateGame); // Update du jeu
router.delete("/games/:id", deleteGame); // Supprime par l'id

export default router;
