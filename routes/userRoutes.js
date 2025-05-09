import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

// Récupérer le profil de l'utilisateur connecté
router.get("/me", protect, getUser);

// Récupérer tous les utilisateurs
router.get("/", protect, getAllUsers);

// Mettre à jour le profil de l'utilisateur connecté
router.put("/me", protect, updateUser);

// Supprimer un utilisateur par son ID (admin)
router.delete("/:id", protect, deleteUser);

export default router;


