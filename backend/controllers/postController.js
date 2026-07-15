// ============================================================
// Nexora — Post Controller
// ============================================================

import Post from "../models/Post.js";
import User from "../models/User.js";

// ── @route   POST /api/posts ─────────────────────────────────
// ── @access  Private
export const createPost = async (req, res) => {
  try {
    const { caption, tags } = req.body;

    if (!caption && !req.file) {
      return res
        .status(400)
        .json({ message: "Post must have a caption or image" });
    }

    const post = await Post.create({
      user: req.user._id,
      caption: caption || "",
      image: req.file ? req.file.filename : "",
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    });

    // Populate user info before returning
    await post.populate("user", "username profileImage fullName");

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   GET /api/posts/feed ────────────────────────────
// ── @access  Private
export const getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    // Get posts from followed users + own posts
    const feedUserIds = [...currentUser.following, req.user._id];

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: { $in: feedUserIds } })
      .populate("user", "username profileImage fullName isVerified")
      .populate("comments.user", "username profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({
      user: { $in: feedUserIds },
    });

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: page * limit < totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   GET /api/posts/:id ──────────────────────────────
// ── @access  Private
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username profileImage fullName isVerified")
      .populate("comments.user", "username profileImage");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   PUT /api/posts/:id ──────────────────────────────
// ── @access  Private
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only the post owner can edit
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    post.caption = req.body.caption || post.caption;
    if (req.file) post.image = req.file.filename;

    const updated = await post.save();
    await updated.populate("user", "username profileImage fullName");

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   DELETE /api/posts/:id ──────────────────────────
// ── @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   POST /api/posts/:id/like ───────────────────────
// ── @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      likes: post.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   POST /api/posts/:id/comment ────────────────────
// ── @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = { user: req.user._id, text };
    post.comments.push(newComment);
    await post.save();

    await post.populate("comments.user", "username profileImage");

    const addedComment = post.comments[post.comments.length - 1];
    res.status(201).json(addedComment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   DELETE /api/posts/:id/comment/:commentId ───────
// ── @access  Private
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};