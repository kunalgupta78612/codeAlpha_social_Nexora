import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getSuggestions, followUser } from "../utils/api";
import {
  FiHome, FiSearch, FiUser, FiEdit, FiLogOut,
} from "react-icons/fi";
import { RiRocketLine } from "react-icons/ri";
import toast from "react-hot-toast";
import "../styles/components.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await getSuggestions();
        setSuggestions(data);
      } catch {}
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (id) => {
    try {
      await followUser(id);
      setSuggestions((prev) => prev.filter((u) => u._id !== id));
      toast.success("Followed!");
    } catch {
      toast.error("Failed to follow");
    }
  };

  const navItems = [
    { to: "/", icon: <FiHome size={20} />, label: "Home" },
    { to: "/search", icon: <FiSearch size={20} />, label: "Search" },
    { to: `/profile/${user?._id}`, icon: <FiUser size={20} />, label: "Profile" },
    { to: "/edit-profile", icon: <FiEdit size={20} />, label: "Edit Profile" },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <RiRocketLine size={24} />
        <span>Nexora</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            end={to === "/"}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="sidebar-suggestions">
          <p className="suggestions-title">Suggested for you</p>
          {suggestions.map((u) => (
            <div key={u._id} className="suggestion-item">
              <img
                src={u.profileImage
                  ? `${import.meta.env.VITE_UPLOADS_URL}/${u.profileImage}`
                  : `https://ui-avatars.com/api/?name=${u.username}&background=6c63ff&color=fff`}
                alt={u.username}
                className="avatar"
                style={{ width: 36, height: 36, cursor: "pointer" }}
                onClick={() => navigate(`/profile/${u._id}`)}
              />
              <div className="suggestion-info" onClick={() => navigate(`/profile/${u._id}`)}>
                <span className="suggestion-name">{u.username}</span>
                <span className="suggestion-sub">{u.followers?.length || 0} followers</span>
              </div>
              <button className="btn btn-outline btn-xs" onClick={() => handleFollow(u._id)}>
                Follow
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Logout */}
      <button
        className="sidebar-logout"
        onClick={() => { logout(); navigate("/login"); }}
      >
        <FiLogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;