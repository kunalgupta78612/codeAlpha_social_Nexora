// ============================================================
// Nexora — User Routes
// ============================================================

import express from "express";
import {
  getUserById,
  updateProfile,
  followUser,
  searchUsers,
  getUserPosts,
  getSuggestions,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All routes below are protected
router.get("/search", protect, searchUsers);                          // GET  /api/users/search?q=
router.get("/suggestions", protect, getSuggestions);                  // GET  /api/users/suggestions
router.get("/:id", protect, getUserById);                             // GET  /api/users/:id
router.get("/:id/posts", protect, getUserPosts);                      // GET  /api/users/:id/posts
router.post("/:id/follow", protect, followUser);                      // POST /api/users/:id/follow
router.put("/profile", protect, upload.single("profileImage"), updateProfile); // PUT /api/users/profile

export default router;