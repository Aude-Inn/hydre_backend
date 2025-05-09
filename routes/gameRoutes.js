import express from "express";
import {
  createGame,
  getGame,
  getAllGames,
  updateGame,
  deleteGame,
} from "../controllers/gameController.js";

const router = express.Router();

router.post("/", createGame);        // Créer un jeu
router.get("/", getAllGames);        // Obtenir tous les jeux
router.get("/:id", getGame);         // Obtenir un jeu par ID
router.put("/:id", updateGame);      // Mettre à jour un jeu
router.delete("/:id", deleteGame);   // Supprimer un jeu par ID

export default router;