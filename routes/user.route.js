import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ Get all users - no auth required
router.get("/", getUsers);

// ✅ Update a user - auth required
router.put("/:id", verifyToken, updateUser);

// ✅ Delete a user - auth required
router.delete("/:id", verifyToken, deleteUser);

// ✅ Save or unsave a post - auth required
router.post("/save", verifyToken, savePost);

// ✅ Get posts created and saved by logged-in user - auth required
router.get("/profilePosts", verifyToken, profilePosts);

router.get("/notification", verifyToken, getNotificationNumber);

export default router;
