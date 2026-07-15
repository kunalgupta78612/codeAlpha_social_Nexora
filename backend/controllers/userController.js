// ============================================================
// Nexora — User Controller
// ============================================================

import User from "../models/User.js";
import Post from "../models/Post.js";

// ── @route   GET /api/users/:id ──────────────────────────────
// ── @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username profileImage fullName")
      .populate("following", "username profileImage fullName");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   PUT /api/users/profile ─────────────────────────
// ── @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, website, location } = req.body;

    const updatedFields = { fullName, bio, website, location };

    // If a profile image was uploaded, save filename
    if (req.file) {
      updatedFields.profileImage = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   POST /api/users/:id/follow ─────────────────────
// ── @access  Private
export const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user._id;

    // Can't follow yourself
    if (targetId === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const isFollowing = currentUser.following.includes(targetId);

    if (isFollowing) {
      // Unfollow: remove from both arrays
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetId },
      });
      await User.findByIdAndUpdate(targetId, {
        $pull: { followers: currentUserId },
      });

      return res.status(200).json({ message: "Unfollowed successfully", following: false });
    } else {
      // Follow: add to both arrays
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: targetId },
      });
      await User.findByIdAndUpdate(targetId, {
        $addToSet: { followers: currentUserId },
      });

      return res.status(200).json({ message: "Followed successfully", following: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   GET /api/users/search?q=query ──────────────────
// ── @access  Private
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Case-insensitive search on username or fullName
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   GET /api/users/:id/posts ───────────────────────
// ── @access  Private
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .populate("user", "username profileImage fullName")
      .populate("comments.user", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── @route   GET /api/users/suggestions ─────────────────────
// ── @access  Private
export const getSuggestions = async (req, res) => {
  try {
    // Return users not followed by current user (excluding self)
    const currentUser = await User.findById(req.user._id);

    const suggestions = await User.find({
      _id: { $nin: [...currentUser.following, req.user._id] },
    })
      .select("username fullName profileImage followers")
      .limit(5);

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};