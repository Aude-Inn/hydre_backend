import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Register
router.post("/register", registerUser);
// Co
router.post("/login", loginUser);
// Déco
router.post("/logout", logoutUser);
// Forgot MDP
router.post('/forgot-password', forgotPassword);
// Reset MDP
router.post('/reset-password/:token', resetPassword); 

export default router;


