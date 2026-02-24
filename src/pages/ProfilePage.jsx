import { Link, useNavigate } from "react-router-dom";
import {
  IoPersonOutline, IoTimeOutline, IoLogOutOutline,
  IoCheckmarkCircle, IoCarOutline, IoArrowForward,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/formatCurrency";
import "./ProfilePage.css";

const STATUS_STYLES = {
  Delivered: "status-delivered",
  Shipped:   "status-shipped",
  Processing:"status-processing",
};

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="page-wrapper profile-page">
        <div className="container">
          <div className="profile-login-prompt">
            <IoPersonOutline size={64} />
            <h2>Please sign in to view your profile</h2>
            <Link to="/auth" className="btn btn-primary btn-lg">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully.");
    navigate("/");
  };

  return (
    <div className="page-wrapper profile-page">
      <div className="container">
        <h1 className="page-title">My Profile</h1>

        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-user-card">
              <img src={user.avatar} alt={user.name} className="profile-avatar" />
              <div className="profile-user-info">
                <h3 className="profile-name">{user.name}</h3>
                <p className="profile-email">{user.email}</p>
                <p className="profile-joined">
                  Member since {new Date(user.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-num">{user.orders?.length || 0}</span>
                <span className="profile-stat-label">Orders</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-num">
                  {formatCurrency(user.orders?.reduce((s, o) => s + o.total, 0) || 0)}
                </span>
                <span className="profile-stat-label">Total Spent</span>
              </div>
            </div>
            <button className="profile-logout-btn" onClick={handleLogout}>
              <IoLogOutOutline size={18} /> Sign Out
            </button>
          </aside>

          {/* Content */}
          <div className="profile-content">
            {/* Account Info */}
            <div className="profile-section">
              <h2 className="profile-section-title">
                <IoPersonOutline size={20} /> Account Information
              </h2>
              <div className="account-info-grid">
                {[
                  { label: "Full Name",  value: user.name },
                  { label: "Email",      value: user.email },
                  { label: "Member Since", value: new Date(user.joinedDate).toLocaleDateString() },
                  { label: "Account ID", value: user.id },
                ].map(({ label, value }) => (
                  <div key={label} className="account-info-item">
                    <span className="account-info-label">{label}</span>
                    <span className="account-info-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order History */}
            <div className="profile-section">
              <h2 className="profile-section-title">
                <IoTimeOutline size={20} /> Order History
              </h2>
              {user.orders && user.orders.length > 0 ? (
                <div className="orders-list">
                  {user.orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-card__top">
                        <div>
                          <p className="order-id">{order.id}</p>
                          <p className="order-date">{order.date}</p>
                        </div>
                        <span className={`order-status ${STATUS_STYLES[order.status] || ""}`}>
                          {order.status === "Delivered" && <IoCheckmarkCircle size={14} />}
                          {order.status === "Shipped"   && <IoCarOutline size={14} />}
                          {order.status}
                        </span>
                      </div>
                      <div className="order-card__bottom">
                        <span className="order-items">{order.items} item{order.items > 1 ? "s" : ""}</span>
                        <span className="order-total">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="orders-empty">
                  <p>No orders yet.</p>
                  <Link to="/shop" className="btn btn-primary">
                    Start Shopping <IoArrowForward />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
