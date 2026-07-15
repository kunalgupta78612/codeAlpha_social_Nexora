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
      <div className="flex min-h-screen pt-[var(--navbar-height)]">
        <div className="flex-1 ml-0 md:ml-[var(--sidebar-width)] p-4 md:p-6 max-w-full md:max-w-[680px]">
          {/* Story Bar */}
          <StoryBar />

          {/* Create Post */}
          <div className="glass-card p-4 md:p-5 mb-4">
            {!expanded ? (
              <div className="flex items-center gap-3">
                <img src={avatarSrc} alt="you" className="w-[42px] h-[42px] rounded-full object-cover bg-bg-secondary border-2 border-border" />
                <div className="flex-1 bg-bg-glass border border-border rounded-full py-2.5 px-4 text-sm text-text-muted cursor-pointer transition-colors hover:border-accent hover:ring-[3px] hover:ring-accent-light"
                  onClick={() => setExpanded(true)}>
                  What's on your mind, {user?.fullName || user?.username}?
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <img src={avatarSrc} alt="you" className="w-[42px] h-[42px] rounded-full object-cover bg-bg-secondary border-2 border-border" />
                  <textarea
                    className="flex-1 bg-transparent text-text-primary text-sm resize-none outline-none placeholder:text-text-muted mt-2"
                    rows="3"
                    placeholder={`What's on your mind, ${user?.fullName || user?.username}?`}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={500}
                    autoFocus
                  />
                </div>

                {imagePreview && (
                  <div className="relative rounded-md overflow-hidden">
                    <img src={imagePreview} alt="preview" className="w-full max-h-[300px] object-cover" />
                    <button className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}>
                      <FiX />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <label htmlFor="post-image" className="inline-flex items-center justify-center gap-2 px-[14px] py-[6px] rounded-full text-[13px] font-semibold transition-all bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent hover:bg-accent-light cursor-pointer">
                    <FiImage size={15} /> Photo
                  </label>
                  <input id="post-image" type="file" accept="image/*"
                    className="hidden" onChange={handleImageChange} />

                  <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center gap-2 px-[14px] py-[6px] rounded-full text-[13px] font-semibold transition-all bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent hover:bg-accent-light"
                      onClick={() => { setExpanded(false); setCaption(""); setImagePreview(null); }}>
                      Cancel
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 px-[14px] py-[6px] rounded-full text-[13px] font-semibold transition-all bg-accent text-white hover:bg-accent-hover hover:shadow-glow hover:-translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed"
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
            <div className="py-10 text-center">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Your feed is empty</h3>
              <p className="text-sm text-text-muted">Follow some users to see their posts here!</p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
              ))}
              {hasMore && (
               <button className="w-full py-3 text-sm font-medium text-accent hover:text-accent-hover transition-colors" onClick={handleLoadMore}>
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