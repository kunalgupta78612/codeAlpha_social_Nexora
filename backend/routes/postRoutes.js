// ============================================================
// Nexora — Post Routes
// ============================================================

import express from "express";
import {
  createPost,
  getFeed,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/feed", protect, getFeed);                                         // GET  /api/posts/feed
router.post("/", protect, upload.single("image"), createPost);                 // POST /api/posts
router.get("/:id", protect, getPostById);                                      // GET  /api/posts/:id
router.put("/:id", protect, upload.single("image"), updatePost);               // PUT  /api/posts/:id
router.delete("/:id", protect, deletePost);                                    // DELETE /api/posts/:id
router.post("/:id/like", protect, likePost);                                   // POST /api/posts/:id/like
router.post("/:id/comment", protect, addComment);                              // POST /api/posts/:id/comment
router.delete("/:id/comment/:commentId", protect, deleteComment);             // DELETE /api/posts/:id/comment/:commentId

export default router;