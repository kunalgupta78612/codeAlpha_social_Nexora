// ============================================================
// Nexora — Post Model (Mongoose Schema)
// ============================================================

import mongoose from "mongoose";

// ── Comment Sub-Schema ───────────────────────────────────────
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      maxlength: [300, "Comment cannot exceed 300 characters"],
      trim: true,
    },
  },
  { timestamps: true }
);

// ── Post Schema ──────────────────────────────────────────────
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    caption: {
      type: String,
      maxlength: [500, "Caption cannot exceed 500 characters"],
      trim: true,
      default: "",
    },

    image: {
      type: String,
      default: "", // Filename of uploaded image
    },

    // Array of user IDs who liked this post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema],

    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ── Virtual: Like count ──────────────────────────────────────
postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// ── Virtual: Comment count ───────────────────────────────────
postSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// ── Index for faster feed queries ───────────────────────────
postSchema.index({ user: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);
export default Post;