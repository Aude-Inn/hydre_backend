import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();



// all user
router.get("/", protect, getAllUsers);

// Get user by ID
router.get("/:id", protect, getUserById);

// Update user by id
router.put("/:id", protect, updateUserById);

// Delete user by id
router.delete("/:id", protect, deleteUser);

export default router;


