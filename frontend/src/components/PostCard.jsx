import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { likePost, deletePost } from "../utils/api";
import CommentSection from "./CommentSection";
import { format } from "timeago.js";
import {
  FiHeart, FiMessageCircle, FiTrash2, FiMoreHorizontal,
} from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import toast from "react-hot-toast";
import "../styles/components.css";

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isLiked = likes.includes(user?._id);
  const isOwner = post.user?._id === user?._id;

  const handleLike = async () => {
    try {
      const { data } = await likePost(post._id);
      setLikes(data.likes);
    } catch {
      toast.error("Failed to like post");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(post._id);
      toast.success("Post deleted");
      onDelete?.(post._id);
    } catch {
      toast.error("Failed to delete post");
    }
    setShowMenu(false);
  };

  const avatarSrc = post.user?.profileImage
    ? `${import.meta.env.VITE_UPLOADS_URL}/${post.user.profileImage}`
    : `https://ui-avatars.com/api/?name=${post.user?.username}&background=6c63ff&color=fff`;

  return (
    <div className="post-card glass-card fade-in">
      {/* Header */}
      <div className="post-header">
        <div
          className="post-user-info"
          onClick={() => navigate(`/profile/${post.user?._id}`)}
        >
          <img src={avatarSrc} alt={post.user?.username}
            className="avatar" style={{ width: 42, height: 42 }} />
          <div>
            <div className="post-username">
              {post.user?.fullName || post.user?.username}
              {post.user?.isVerified && (
                <MdVerified size={14} color="#6c63ff" style={{ marginLeft: 4 }} />
              )}
            </div>
            <div className="post-handle">
              @{post.user?.username} · {format(post.createdAt)}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="post-menu-wrap">
            <button className="icon-btn" onClick={() => setShowMenu(!showMenu)}>
              <FiMoreHorizontal size={18} />
            </button>
            {showMenu && (
              <div className="post-menu">
                <button onClick={handleDelete} className="menu-item danger">
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="post-caption">{post.caption}</p>
      )}

      {/* Image */}
      {post.image && (
        <div className="post-image-wrap">
          <img
            src={`${import.meta.env.VITE_UPLOADS_URL}/${post.image}`}
            alt="post"
            className="post-image"
          />
        </div>
      )}

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          {isLiked
            ? <AiFillHeart size={20} color="#f87171" />
            : <FiHeart size={20} />}
          <span>{likes.length}</span>
        </button>

        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <FiMessageCircle size={20} />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection postId={post._id} initialComments={post.comments} />
      )}
    </div>
  );
};

export default PostCard;