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
import "../styles/profile.css";

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
  if (!profile) return <div style={{ padding: 40, textAlign: "center" }}>User not found</div>;

  const avatarSrc = profile.profileImage
    ? `${import.meta.env.VITE_UPLOADS_URL}/${profile.profileImage}`
    : `https://ui-avatars.com/api/?name=${profile.username}&background=6c63ff&color=fff&size=200`;

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="profile-page">
        {/* Cover */}
        <div className="profile-cover-placeholder" />

        {/* Info Card */}
        <div className="profile-info-card glass-card">
          <div className="profile-avatar-row">
            <img src={avatarSrc} alt={profile.username} className="profile-avatar" />
            <div>
              {isOwnProfile ? (
                <button className="btn btn-outline btn-sm"
                  onClick={() => navigate("/edit-profile")}>
                  <FiEdit2 size={14} /> Edit Profile
                </button>
              ) : (
                <button
                  className={`btn btn-sm ${isFollowing ? "btn-outline" : "btn-primary"}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          <div className="profile-name">
            {profile.fullName || profile.username}
            {profile.isVerified && <MdVerified size={18} color="#6c63ff" />}
          </div>
          <div className="profile-handle">@{profile.username}</div>

          {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          <div className="profile-meta">
            {profile.location && (
              <span className="profile-meta-item">
                <FiMapPin size={13} /> {profile.location}
              </span>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer"
                className="profile-meta-item" style={{ color: "var(--accent)" }}>
                <FiLink size={13} /> {profile.website}
              </a>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profile.followers?.length || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profile.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="profile-posts">
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <button className={`btn ${view === "grid" ? "btn-primary" : "btn-outline"} btn-sm`}
              onClick={() => setView("grid")}>Grid</button>
            <button className={`btn ${view === "list" ? "btn-primary" : "btn-outline"} btn-sm`}
              onClick={() => setView("list")}>List</button>
          </div>

          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
              No posts yet
            </div>
          ) : view === "grid" ? (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post._id} className="grid-post">
                  {post.image ? (
                    <>
                      <img src={`${import.meta.env.VITE_UPLOADS_URL}/${post.image}`} alt="post" />
                      <div className="grid-post-overlay">
                        <span><AiFillHeart size={16} /> {post.likes?.length || 0}</span>
                        <span><FiMessageCircle size={16} /> {post.comments?.length || 0}</span>
                      </div>
                    </>
                  ) : (
                    <div style={{
                      width: "100%", height: "100%", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      padding: 12, fontSize: 13, color: "var(--text-secondary)"
                    }}>
                      {post.caption?.slice(0, 80)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post}
                onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;