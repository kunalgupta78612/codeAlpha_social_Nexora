import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getSuggestions, followUser } from "../utils/api";
import {
  FiHome, FiSearch, FiUser, FiEdit, FiLogOut,
} from "react-icons/fi";
import { RiRocketLine } from "react-icons/ri";
import toast from "react-hot-toast";

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
    <aside className="hidden md:flex fixed top-[var(--navbar-height)] left-0 w-[var(--sidebar-width)] h-[calc(100vh-var(--navbar-height))] p-6 px-4 flex-col gap-2 border-r border-border bg-bg-secondary overflow-y-auto z-[100]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 text-[18px] font-bold text-accent py-2 px-3 mb-2">
        <RiRocketLine size={24} />
        <span>Nexora</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 py-[11px] px-[14px] rounded-xl text-[15px] font-medium transition-colors hover:bg-bg-glass hover:text-text-primary ${isActive ? "bg-accent-light text-accent" : "text-text-secondary"}`
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
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-[0.8px] mb-3 px-1">Suggested for you</p>
          {suggestions.map((u) => (
            <div key={u._id} className="flex items-center gap-2.5 py-2 px-1">
              <img
                src={u.profileImage
                  ? `${import.meta.env.VITE_UPLOADS_URL}/${u.profileImage}`
                  : `https://ui-avatars.com/api/?name=${u.username}&background=6c63ff&color=fff`}
                alt={u.username}
                className="w-9 h-9 rounded-full object-cover bg-bg-secondary border-2 border-border cursor-pointer"
                onClick={() => navigate(`/profile/${u._id}`)}
              />
              <div className="flex-1 cursor-pointer" onClick={() => navigate(`/profile/${u._id}`)}>
                <span className="block text-[13px] font-semibold text-text-primary">{u.username}</span>
                <span className="text-[11px] text-text-muted">{u.followers?.length || 0} followers</span>
              </div>
              <button className="inline-flex items-center justify-center gap-2 px-[10px] py-1 rounded-full text-xs font-semibold transition-all bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent hover:bg-accent-light" onClick={() => handleFollow(u._id)}>
                Follow
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Logout */}
      <button
        className="mt-auto flex items-center gap-2.5 py-[11px] px-[14px] rounded-xl bg-transparent text-danger text-[15px] font-medium transition-colors border-none cursor-pointer hover:bg-danger/10"
        onClick={() => { logout(); navigate("/login"); }}
      >
        <FiLogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;