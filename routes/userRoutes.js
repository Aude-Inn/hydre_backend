import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUser,
  updateUser,
  updateUserById,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Profil user co
router.get("/me", protect, getUser);

// // Update user(a verifier si util)
// router.put("/me", protect, updateUser);

// all user
router.get("/", protect, getAllUsers);

// update user by id
router.put("/:id", protect, updateUserById);

// delete user by id
router.delete("/:id", protect, deleteUser);

export default router;


