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
    <div className="glass-card p-5 mb-4 transition-colors hover:border-border-hover animate-[fadeIn_0.4s_ease_forwards]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${post.user?._id}`)}
        >
          <img src={avatarSrc} alt={post.user?.username}
            className="w-[42px] h-[42px] rounded-full object-cover bg-bg-secondary border-2 border-border" />
          <div>
            <div className="text-[15px] font-semibold flex items-center gap-1">
              {post.user?.fullName || post.user?.username}
              {post.user?.isVerified && (
                <MdVerified size={14} color="#6c63ff" className="ml-1" />
              )}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              @{post.user?.username} · {format(post.createdAt)}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent text-text-secondary transition-all border border-transparent hover:bg-bg-glass hover:text-text-primary hover:border-border" onClick={() => setShowMenu(!showMenu)}>
              <FiMoreHorizontal size={18} />
            </button>
            {showMenu && (
              <div className="absolute top-10 right-0 bg-bg-secondary border border-border rounded-xl p-1.5 min-w-[130px] shadow-md z-10">
                <button onClick={handleDelete} className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-[13px] bg-transparent border-none cursor-pointer text-danger transition-colors hover:bg-bg-glass">
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="text-[15px] leading-relaxed text-text-primary mb-3.5 whitespace-pre-wrap">{post.caption}</p>
      )}

      {/* Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-3.5">
          <img
            src={`${import.meta.env.VITE_UPLOADS_URL}/${post.image}`}
            alt="post"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-3 border-t border-border">
        <button
          className={`flex items-center gap-[7px] bg-transparent text-text-secondary text-[14px] font-medium py-1.5 px-3 rounded-full transition-colors border-none cursor-pointer hover:bg-bg-glass hover:text-text-primary ${isLiked ? "!text-danger" : ""}`}
          onClick={handleLike}
        >
          {isLiked
            ? <AiFillHeart size={20} color="#f87171" />
            : <FiHeart size={20} />}
          <span>{likes.length}</span>
        </button>

        <button
          className="flex items-center gap-[7px] bg-transparent text-text-secondary text-[14px] font-medium py-1.5 px-3 rounded-full transition-colors border-none cursor-pointer hover:bg-bg-glass hover:text-text-primary"
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