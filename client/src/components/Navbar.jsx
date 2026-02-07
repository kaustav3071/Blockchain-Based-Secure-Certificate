import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel = {
    admin: "Administrator",
    university: "University",
    user: "Verifier",
  };

  return (
    <nav className="bg-navy-900 text-white px-6 py-3.5 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="CertifyChain" className="w-8 h-8 object-contain" />
        <div>
          <span className="text-lg font-bold tracking-wide">CertifyChain</span>
          <span className="ml-2 text-[10px] bg-navy-700 text-navy-200 px-2 py-0.5 rounded-full font-medium tracking-wide uppercase">Blockchain</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <Link to="/profile" className="text-right hover:opacity-80 transition-opacity">
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-[11px] text-navy-300">{roleLabel[user?.role] || user?.role}</p>
        </Link>
        <div className="w-px h-8 bg-navy-600"></div>
        <button
          onClick={handleLogout}
          className="text-sm text-navy-200 hover:text-white flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
