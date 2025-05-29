import express from "express";
import {
  createGame,
  getGame,
  getAllGames,
  searchGames,
  topGames,
  updateGame,
  deleteGame,
} from "../controllers/gameController.js";

const router = express.Router();
// Create
router.post("/", createGame);       

// All games
router.get("/", getAllGames); 

// Search games
router.get("/search", searchGames); 

// Top games
router.get('/top', topGames);

// Game by id
router.get("/:id", getGame);         

// Update game
router.put("/:id", updateGame);      

// Delete game by id
router.delete("/:id", deleteGame);   

export default router;