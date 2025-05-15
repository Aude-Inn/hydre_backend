import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUser,
  updateUserById,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Profil user co
router.get("/", protect, getUser);

// all user
router.get("/", protect, getAllUsers);

// update user by id
router.put("/:id", protect, updateUserById);

// delete user by id
router.delete("/:id", protect, deleteUser);

export default router;


