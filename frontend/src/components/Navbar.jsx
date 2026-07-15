import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon, FiSearch, FiLogOut, FiUser } from "react-icons/fi";
import { RiRocketLine } from "react-icons/ri";
import "../styles/components.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarSrc = user?.profileImage
    ? `${import.meta.env.VITE_UPLOADS_URL}/${user.profileImage}`
    : `https://ui-avatars.com/api/?name=${user?.username}&background=6c63ff&color=fff`;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <RiRocketLine size={22} />
          <span>Nexora</span>
        </Link>

        {/* Search Bar */}
        <div className="navbar-search" onClick={() => navigate("/search")}>
          <FiSearch size={16} />
          <span>Search users...</span>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <Link to={`/profile/${user?._id}`} className="icon-btn" title="Profile">
            <FiUser size={18} />
          </Link>

          <img
            src={avatarSrc}
            alt={user?.username}
            className="avatar nav-avatar"
            style={{ width: 34, height: 34 }}
            onClick={() => navigate(`/profile/${user?._id}`)}
          />

          <button className="icon-btn danger" onClick={handleLogout} title="Logout">
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;