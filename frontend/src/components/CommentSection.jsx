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
    <div className="comment-section">
      {/* Comment list */}
      <div className="comment-list">
        {comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first!</p>
        )}
        {comments.map((comment) => {
          const avatarSrc = comment.user?.profileImage
            ? `${import.meta.env.VITE_UPLOADS_URL}/${comment.user.profileImage}`
            : `https://ui-avatars.com/api/?name=${comment.user?.username}&background=6c63ff&color=fff`;

          return (
            <div key={comment._id} className="comment-item">
              <img src={avatarSrc} alt={comment.user?.username}
                className="avatar" style={{ width: 30, height: 30, cursor: "pointer" }}
                onClick={() => navigate(`/profile/${comment.user?._id}`)} />
              <div className="comment-body">
                <span className="comment-username">{comment.user?.username}</span>
                <span className="comment-text">{comment.text}</span>
                <span className="comment-time">{format(comment.createdAt)}</span>
              </div>
              {comment.user?._id === user?._id && (
                <button className="icon-btn danger"
                  onClick={() => handleDelete(comment._id)}>
                  <FiTrash2 size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add comment */}
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          className="form-input comment-input"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={300}
        />
        <button type="submit" className="btn btn-primary comment-submit" disabled={loading}>
          <FiSend size={14} />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;