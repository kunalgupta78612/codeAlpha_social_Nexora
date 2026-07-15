import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addComment, deleteComment } from "../utils/api";
import { format } from "timeago.js";
import { FiSend, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const CommentSection = ({ postId, initialComments = [] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await addComment(postId, { text });
      setComments((prev) => [...prev, data]);
      setText("");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="mt-3.5 pt-3.5 border-t border-border">
      {/* Comment list */}
      <div className="mb-3">
        {comments.length === 0 && (
          <p className="text-[13px] text-text-muted text-center py-3">No comments yet. Be the first!</p>
        )}
        {comments.map((comment) => {
          const avatarSrc = comment.user?.profileImage
            ? `${import.meta.env.VITE_UPLOADS_URL}/${comment.user.profileImage}`
            : `https://ui-avatars.com/api/?name=${comment.user?.username}&background=6c63ff&color=fff`;

          return (
            <div key={comment._id} className="flex items-start gap-2.5 mb-2.5">
              <img src={avatarSrc} alt={comment.user?.username}
                className="w-[30px] h-[30px] rounded-full object-cover bg-bg-secondary border border-border cursor-pointer"
                onClick={() => navigate(`/profile/${comment.user?._id}`)} />
              <div className="flex-1 bg-bg-glass rounded-xl p-2 px-3">
                <span className="text-xs font-semibold text-accent mr-2">{comment.user?.username}</span>
                <span className="text-[13px] text-text-primary">{comment.text}</span>
                <span className="block text-[11px] text-text-muted mt-1">{format(comment.createdAt)}</span>
              </div>
              {comment.user?._id === user?._id && (
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-text-secondary transition-all border border-transparent hover:bg-bg-glass hover:text-danger hover:border-border"
                  onClick={() => handleDelete(comment._id)}>
                  <FiTrash2 size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add comment */}
      <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
        <input
          className="flex-1 bg-bg-glass border border-border rounded-xl px-3.5 py-2 text-[13px] text-text-primary transition-all focus:border-accent focus:ring-[3px] focus:ring-accent-light outline-none placeholder:text-text-muted"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={300}
        />
        <button type="submit" className="inline-flex items-center justify-center p-2.5 rounded-xl transition-all bg-accent text-white hover:bg-accent-hover hover:-translate-y-[1px] hover:shadow-glow disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
          <FiSend size={14} />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;