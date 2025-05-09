import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Récupérer le profil de l'utilisateur connecté
router.get("/me", protect, getUser);

// Mettre à jour le profil de l'utilisateur connecté
router.put("/me", protect, updateUser);

// Récupérer tous les utilisateurs
router.get("/", protect, getAllUsers);

// Supprimer un utilisateur par son ID (admin)
router.delete("/:id", protect, deleteUser);

export default router;


