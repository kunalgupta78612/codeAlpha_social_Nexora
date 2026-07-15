import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon, FiSearch, FiLogOut, FiUser } from "react-icons/fi";
import { RiRocketLine } from "react-icons/ri";

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
    <nav className="fixed top-0 left-0 right-0 h-[var(--navbar-height)] bg-[#0a0a0f]/80 backdrop-blur-[20px] border-b border-border z-[1000] transition-colors duration-300 data-[theme=light]:bg-white/80">
      <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center gap-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-[18px] font-bold text-accent min-w-[160px]">
          <RiRocketLine size={22} />
          <span>Nexora</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-[360px] hidden md:flex items-center gap-2.5 bg-bg-glass border border-border rounded-full py-[9px] px-4 cursor-pointer text-sm text-text-muted transition-colors hover:border-accent" onClick={() => navigate("/search")}>
          <FiSearch size={16} />
          <span>Search users...</span>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent text-text-secondary transition-all border border-transparent hover:bg-bg-glass hover:text-text-primary hover:border-border" onClick={toggleTheme} title="Toggle theme">
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <Link to={`/profile/${user?._id}`} className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent text-text-secondary transition-all border border-transparent hover:bg-bg-glass hover:text-text-primary hover:border-border" title="Profile">
            <FiUser size={18} />
          </Link>

          <img
            src={avatarSrc}
            alt={user?.username}
            className="rounded-full object-cover bg-bg-secondary border-2 border-border cursor-pointer transition-transform hover:scale-105"
            style={{ width: 34, height: 34 }}
            onClick={() => navigate(`/profile/${user?._id}`)}
          />

          <button className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent text-text-secondary transition-all border border-transparent hover:bg-bg-glass hover:text-text-primary hover:border-border hover:!text-danger" onClick={handleLogout} title="Logout">
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;