import { Link, useNavigate } from "react-router-dom";
import { IoExitOutline, IoShieldCheckmarkOutline, IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar__container">
        <div className="admin-navbar__brand">
          <div className="admin-logo-icon">
            <IoShieldCheckmarkOutline size={20} />
          </div>
          <span className="admin-logo-text">LuxeGear <span>Admin Suite</span></span>
        </div>

        <div className="admin-navbar__actions">
          <Link to="/" className="admin-nav-link exit-btn">
            <IoExitOutline size={18} /> Exit to Shop
          </Link>
          
          <div className="admin-navbar__divider" />

          <div className="admin-navbar__user">
            <img src={user?.avatar} alt="" className="admin-avatar" />
            <div className="admin-user-info">
              <span className="admin-user-name">{user?.name}</span>
              <span className="admin-user-role">System Authority</span>
            </div>
          </div>

          <button onClick={handleLogout} className="admin-nav-link logout-btn" title="End Session">
            <IoLogOutOutline size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
