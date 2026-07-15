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
      className="glass-card flex items-center gap-3.5 p-4 cursor-pointer transition-all mb-2.5 hover:border-border-hover hover:-translate-y-px"
      onClick={() => navigate(`/profile/${userData._id}`)}
    >
      <img src={avatarSrc} alt={userData.username}
        className="w-14 h-14 rounded-full object-cover bg-bg-secondary border-2 border-border" />
      <div className="flex-1">
        <div className="text-[15px] font-semibold flex items-center gap-1">
          {userData.fullName || userData.username}
          {userData.isVerified && <MdVerified size={14} color="#6c63ff" />}
        </div>
        <div className="text-xs text-text-muted">@{userData.username}</div>
        <div className="text-xs text-text-secondary mt-1">
          <span>{userData.followers?.length || 0} followers</span>
        </div>
      </div>
      {!isOwnProfile && (
        <button
          className={`inline-flex items-center justify-center gap-2 px-[14px] py-[6px] rounded-full text-[13px] font-semibold transition-all ${isFollowing ? "bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent hover:bg-accent-light" : "bg-accent text-white hover:bg-accent-hover hover:shadow-glow hover:-translate-y-[1px]"}`}
          onClick={handleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserCard;