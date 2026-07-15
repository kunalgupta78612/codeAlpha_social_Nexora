import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getFeed, createPost } from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StoryBar from "../components/StoryBar";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { FiImage, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import "../styles/home.css";

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // Fetch feed posts
  const fetchFeed = useCallback(async (pageNum = 1, append = false) => {
    try {
      const { data } = await getFeed(pageNum);
      setPosts((prev) => append ? [...prev, ...data.posts] : data.posts);
      setHasMore(data.hasMore);
    } catch {
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit new post
  const handlePost = async () => {
    if (!caption.trim() && !imageFile) {
      return toast.error("Add a caption or image");
    }
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (imageFile) formData.append("image", imageFile);

      const { data } = await createPost(formData);
      setPosts((prev) => [data, ...prev]);
      setCaption("");
      setImageFile(null);
      setImagePreview(null);
      setExpanded(false);
      toast.success("Post created! 🎉");
    } catch {
      toast.error("Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage, true);
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const avatarSrc = user?.profileImage
    ? `${import.meta.env.VITE_UPLOADS_URL}/${user.profileImage}`
    : `https://ui-avatars.com/api/?name=${user?.username}&background=6c63ff&color=fff`;

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="home-page">
        <div className="feed-column">
          {/* Story Bar */}
          <StoryBar />

          {/* Create Post */}
          <div className="create-post-card glass-card">
            {!expanded ? (
              <div className="create-post-top">
                <img src={avatarSrc} alt="you" className="avatar"
                  style={{ width: 42, height: 42 }} />
                <div className="create-post-input"
                  onClick={() => setExpanded(true)}>
                  What's on your mind, {user?.fullName || user?.username}?
                </div>
              </div>
            ) : (
              <div className="create-post-expanded">
                <div className="create-post-top">
                  <img src={avatarSrc} alt="you" className="avatar"
                    style={{ width: 42, height: 42 }} />
                  <textarea
                    placeholder={`What's on your mind, ${user?.fullName || user?.username}?`}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={500}
                    autoFocus
                  />
                </div>

                {imagePreview && (
                  <div className="post-image-preview">
                    <img src={imagePreview} alt="preview" />
                    <button className="remove-image"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}>
                      <FiX />
                    </button>
                  </div>
                )}

                <div className="create-post-actions">
                  <label htmlFor="post-image" className="btn btn-outline btn-sm"
                    style={{ cursor: "pointer" }}>
                    <FiImage size={15} /> Photo
                  </label>
                  <input id="post-image" type="file" accept="image/*"
                    style={{ display: "none" }} onChange={handleImageChange} />

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-outline btn-sm"
                      onClick={() => { setExpanded(false); setCaption(""); setImagePreview(null); }}>
                      Cancel
                    </button>
                    <button className="btn btn-primary btn-sm"
                      onClick={handlePost} disabled={posting}>
                      {posting ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Posts Feed */}
          {posts.length === 0 ? (
            <div className="feed-empty">
              <h3>Your feed is empty</h3>
              <p>Follow some users to see their posts here!</p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
              ))}
              {hasMore && (
                <button className="load-more-btn" onClick={handleLoadMore}>
                  Load more posts
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;