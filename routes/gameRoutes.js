import express from "express";
import {
  createGame,
  getGame,
  getAllGames,
  updateGame,
  deleteGame,
} from "../controllers/gameController.js";

const router = express.Router();
// créer un jeu
router.post("/", createGame);       

// all games
router.get("/", getAllGames);        

// game by id
router.get("/:id", getGame);         

// update game
router.put("/:id", updateGame);      

// delete game by id
router.delete("/:id", deleteGame);   

export default router;