import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserById, getUserPosts, followUser } from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";
import { FiEdit2, FiMapPin, FiLink } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import { FiMessageCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [view, setView] = useState("grid"); // grid | list

  const isOwnProfile = id === currentUser?._id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [{ data: profileData }, { data: postsData }] = await Promise.all([
          getUserById(id),
          getUserPosts(id),
        ]);
        setProfile(profileData);
        setPosts(postsData);
        setIsFollowing(
          profileData.followers?.some((f) => f._id === currentUser?._id || f === currentUser?._id)
        );
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, currentUser?._id]);

  const handleFollow = async () => {
    try {
      const { data } = await followUser(id);
      setIsFollowing(data.following);
      setProfile((prev) => ({
        ...prev,
        followers: data.following
          ? [...(prev.followers || []), currentUser._id]
          : (prev.followers || []).filter((f) => f !== currentUser._id && f._id !== currentUser._id),
      }));
      toast.success(data.following ? "Followed!" : "Unfollowed");
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) return <Loader />;
  if (!profile) return <div className="p-10 text-center">User not found</div>;

  const avatarSrc = profile.profileImage
    ? `${import.meta.env.VITE_UPLOADS_URL}/${profile.profileImage}`
    : `https://ui-avatars.com/api/?name=${profile.username}&background=6c63ff&color=fff&size=200`;

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="pt-[calc(var(--navbar-height)+24px)] md:pl-[calc(var(--sidebar-width)+24px)] pl-4 pr-4 md:pr-6 max-w-[1000px] mx-auto pb-10">
        {/* Cover */}
        <div className="w-full h-[220px] rounded-2xl bg-gradient-to-br from-accent to-[#ff6b9d] -mb-[60px]" />

        {/* Info Card */}
        <div className="glass-card p-6 relative">
          <div className="flex items-end justify-between mb-4">
            <img src={avatarSrc} alt={profile.username} className="w-[100px] h-[100px] border-4 border-bg-secondary rounded-full object-cover bg-bg-secondary -mt-[40px]" />
            <div>
              {isOwnProfile ? (
                <button className="inline-flex items-center justify-center gap-2 px-[14px] py-[6px] rounded-full text-[13px] font-semibold transition-all bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent hover:bg-accent-light"
                  onClick={() => navigate("/edit-profile")}>
                  <FiEdit2 size={14} /> Edit Profile
                </button>
              ) : (
                <button
                  className={`inline-flex items-center justify-center gap-2 px-[14px] py-[6px] rounded-full text-[13px] font-semibold transition-all ${isFollowing ? "bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent hover:bg-accent-light" : "bg-accent text-white hover:bg-accent-hover hover:shadow-glow hover:-translate-y-[1px]"}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          <div className="text-[22px] font-bold flex items-center gap-1.5">
            {profile.fullName || profile.username}
            {profile.isVerified && <MdVerified size={18} color="#6c63ff" />}
          </div>
          <div className="text-sm text-text-muted mt-0.5">@{profile.username}</div>

          {profile.bio && <p className="text-sm leading-relaxed text-text-secondary my-3">{profile.bio}</p>}

          <div className="flex gap-4 flex-wrap mb-4">
            {profile.location && (
              <span className="flex items-center gap-1.5 text-[13px] text-text-muted">
                <FiMapPin size={13} /> {profile.location}
              </span>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-[13px] text-accent hover:underline">
                <FiLink size={13} /> {profile.website}
              </a>
            )}
          </div>

          <div className="flex gap-6 my-4 py-4 border-y border-border">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[20px] font-bold text-text-primary">{posts.length}</span>
              <span className="text-xs text-text-muted">Posts</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[20px] font-bold text-text-primary">{profile.followers?.length || 0}</span>
              <span className="text-xs text-text-muted">Followers</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[20px] font-bold text-text-primary">{profile.following?.length || 0}</span>
              <span className="text-xs text-text-muted">Following</span>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-6">
          <div className="flex gap-3 mb-4">
            <button className={`inline-flex items-center justify-center gap-2 px-[14px] py-[6px] rounded-full text-[13px] font-semibold transition-all ${view === "grid" ? "bg-accent text-white hover:bg-accent-hover hover:shadow-glow hover:-translate-y-[1px]" : "bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent hover:bg-accent-light"}`}
              onClick={() => setView("grid")}>Grid</button>
            <button className={`inline-flex items-center justify-center gap-2 px-[14px] py-[6px] rounded-full text-[13px] font-semibold transition-all ${view === "list" ? "bg-accent text-white hover:bg-accent-hover hover:shadow-glow hover:-translate-y-[1px]" : "bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent hover:bg-accent-light"}`}
              onClick={() => setView("list")}>List</button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center p-10 text-text-muted">
              No posts yet
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 rounded-xl overflow-hidden">
              {posts.map((post) => (
                <div key={post._id} className="aspect-square overflow-hidden cursor-pointer relative bg-bg-glass group">
                  {post.image ? (
                    <>
                      <img src={`${import.meta.env.VITE_UPLOADS_URL}/${post.image}`} alt="post" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-300 text-white text-[15px] font-semibold group-hover:opacity-100">
                        <span className="flex items-center gap-1.5"><AiFillHeart size={16} /> {post.likes?.length || 0}</span>
                        <span className="flex items-center gap-1.5"><FiMessageCircle size={16} /> {post.comments?.length || 0}</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-3 text-[13px] text-text-secondary text-center hover:bg-black/10 transition-colors">
                      {post.caption?.slice(0, 80)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post}
                  onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;