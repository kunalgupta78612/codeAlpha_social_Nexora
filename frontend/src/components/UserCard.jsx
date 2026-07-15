import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { followUser } from "../utils/api";
import { MdVerified } from "react-icons/md";
import toast from "react-hot-toast";

const UserCard = ({ userData }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(
    userData.followers?.includes(user?._id)
  );

  const handleFollow = async (e) => {
    e.stopPropagation();
    try {
      const { data } = await followUser(userData._id);
      setIsFollowing(data.following);
      toast.success(data.following ? "Followed!" : "Unfollowed");
    } catch {
      toast.error("Action failed");
    }
  };

  const avatarSrc = userData.profileImage
    ? `${import.meta.env.VITE_UPLOADS_URL}/${userData.profileImage}`
    : `https://ui-avatars.com/api/?name=${userData.username}&background=6c63ff&color=fff`;

  const isOwnProfile = userData._id === user?._id;

  return (
    <div
      className="user-card glass-card"
      onClick={() => navigate(`/profile/${userData._id}`)}
    >
      <img src={avatarSrc} alt={userData.username}
        className="avatar" style={{ width: 56, height: 56 }} />
      <div className="user-card-info">
        <div className="user-card-name">
          {userData.fullName || userData.username}
          {userData.isVerified && <MdVerified size={14} color="#6c63ff" />}
        </div>
        <div className="user-card-handle">@{userData.username}</div>
        <div className="user-card-stats">
          <span>{userData.followers?.length || 0} followers</span>
        </div>
      </div>
      {!isOwnProfile && (
        <button
          className={`btn ${isFollowing ? "btn-outline" : "btn-primary"} btn-sm`}
          onClick={handleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserCard;