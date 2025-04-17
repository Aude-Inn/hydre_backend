import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

// le profil de l'utilisateur connecté
router.get("/profile", protect, getUser);

// tous les utilisateurs
router.get("/allUsers", protect, getAllUsers);

// mettre à jour les données de l'utilisateur connecté
router.put("/updateUser", protect, updateUser);

// supprimer un utilisateur par son ID
router.delete("/user/:id", protect, deleteUser);

export default router;


