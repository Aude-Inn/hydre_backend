import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// l'inscription
router.post("/register", registerUser);
// Connexion
router.post("/login", loginUser);
// Déconnexion
router.post("/logout", logoutUser);
// forgot MDP
router.post('/forgot-password', forgotPassword);
// reset MDP
router.post('/reset-password/:token', resetPassword); 

export default router;


