import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoShieldCheckmarkOutline, IoArrowForward, IoLockClosedOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./AdminLoginPage.css";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success && result.user.role === "admin") {
        toast.success("System Authority Verified. Welcome, Admin.");
        navigate("/admin");
      } else if (result.success) {
        toast.error("Access Denied: Administrative privileges required.");
      }
    } catch (err) {
      toast.error(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-icon-glow">
              <IoShieldCheckmarkOutline size={48} />
            </div>
            <h1 className="admin-login-title">Elite Management</h1>
            <p className="admin-login-sub">Secure Gateway for System Administrators</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group-glow">
              <label>Authority Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@luxegear.com"
              />
            </div>
            <div className="form-group-glow">
              <label>Security Key</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? "Verifying..." : "Initialize Session"} <IoArrowForward />
            </button>
          </form>

          <div className="admin-login-footer">
            <Link to="/" className="back-link">
              <IoLockClosedOutline /> Standard Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
