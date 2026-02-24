import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoGridOutline, IoCubeOutline, IoReceiptOutline,
  IoPeopleOutline, IoCheckmarkCircle, IoCloseCircle,
  IoTrashOutline, IoRefreshOutline, IoShieldOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { adminAPI } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import Spinner from "../components/ui/Spinner";
import "./AdminPage.css";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: <IoGridOutline size={18} /> },
  { key: "products",  label: "Products",  icon: <IoCubeOutline size={18} /> },
  { key: "orders",    label: "Orders",    icon: <IoReceiptOutline size={18} /> },
  { key: "users",     label: "Users",     icon: <IoPeopleOutline size={18} /> },
];

const STATUS_COLORS = {
  pending:    "status-pending",
  processing: "status-processing",
  shipped:    "status-shipped",
  delivered:  "status-delivered",
  cancelled:  "status-cancelled",
};

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab]           = useState("dashboard");
  const [stats, setStats]       = useState(null);
  const [orders, setOrders]     = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate("/auth"); return; }
    if (user?.role !== "admin") { navigate("/"); toast.error("Admin access required."); }
  }, [isAuthenticated, user, navigate, toast]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const { stats: s } = await adminAPI.dashboard();
      setStats(s);
    } catch (e) {
      toast.error(e.message);
    } finally { setLoading(false); }
  }, [toast]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { orders: o } = await adminAPI.getOrders({ limit: 50 });
      setOrders(o);
    } catch (e) {
      toast.error(e.message);
    } finally { setLoading(false); }
  }, [toast]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { users: u } = await adminAPI.getUsers({ limit: 50 });
      setUsers(u);
    } catch (e) {
      toast.error(e.message);
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => {
    if (tab === "dashboard") loadDashboard();
    else if (tab === "orders") loadOrders();
    else if (tab === "users") loadUsers();
  }, [tab, loadDashboard, loadOrders, loadUsers]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await adminAPI.updateStatus(orderId, status);
      toast.success("Order status updated!");
      loadOrders();
    } catch (e) { toast.error(e.message); }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Delete this user?")) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success("User deleted.");
      loadUsers();
    } catch (e) { toast.error(e.message); }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await adminAPI.updateRole(userId, newRole);
      toast.success(`Role updated to ${newRole}`);
      loadUsers();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="page-wrapper admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <div className="admin-badge"><IoShieldOutline size={16} /> Admin Panel</div>
            <h1 className="admin-title">LuxeGear Dashboard</h1>
            <p className="admin-sub">Welcome back, <strong>{user?.name}</strong></p>
          </div>
          <button className="admin-refresh-btn" onClick={() => { if (tab === "dashboard") loadDashboard(); else if (tab === "orders") loadOrders(); else loadUsers(); }}>
            <IoRefreshOutline size={18} /> Refresh
          </button>
        </div>

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="admin-content">
          {loading && (
            <div className="admin-loader">
              <Spinner size="xl" />
            </div>
          )}

          {!loading && tab === "dashboard" && stats && (
            <div className="dashboard-tab">
              <div className="stat-cards">
                {[
                  { label: "Total Revenue",   value: formatCurrency(stats.revenue),      color: "primary",   icon: <IoReceiptOutline size={20} /> },
                  { label: "Weekly Revenue",   value: formatCurrency(stats.weeklyRevenue),color: "accent",    icon: <IoReceiptOutline size={20} /> },
                  { label: "Total Orders",     value: stats.totalOrders,                  color: "secondary", icon: <IoCubeOutline size={20} /> },
                  { label: "Pending Orders",   value: stats.pendingOrders,                color: "gold",      icon: <IoRefreshOutline size={20} /> },
                  { label: "Delivered Orders", value: stats.deliveredOrders,              color: "accent",    icon: <IoCheckmarkCircle size={20} /> },
                  { label: "Total Products",   value: stats.totalProducts,                color: "primary",   icon: <IoCubeOutline size={20} /> },
                  { label: "Total Users",      value: stats.totalUsers,                   color: "secondary", icon: <IoPeopleOutline size={20} /> },
                ].map((s) => (
                  <div key={s.label} className={`stat-card stat-card--${s.color}`}>
                    <span className="stat-card__icon">{s.icon}</span>
                    <div>
                      <p className="stat-card__value">{s.value}</p>
                      <p className="stat-card__label">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-info-box">
                <p><strong>Admin credentials (after seeding):</strong> admin@luxegear.com / admin123</p>
                <p><strong>Postman:</strong> POST <code>/api/auth/login</code> → copy <code>token</code> → use as <code>Bearer &lt;token&gt;</code> in all protected routes.</p>
              </div>
            </div>
          )}

          {!loading && tab === "orders" && (
            <div className="orders-tab">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={7} className="empty-row">No orders yet</td></tr>
                    ) : orders.map((o) => (
                      <tr key={o._id}>
                        <td className="order-id-cell">#{o._id.slice(-6).toUpperCase()}</td>
                        <td>{o.user?.name || o.guestEmail || "Guest"}<br /><span className="table-sub">{o.user?.email}</span></td>
                        <td>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                        <td><strong>{formatCurrency(o.total)}</strong></td>
                        <td>
                          <span className={`table-badge ${STATUS_COLORS[o.status]}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="table-sub">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>
                          <select
                            className="status-select"
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                          >
                            {["pending","processing","shipped","delivered","cancelled"].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === "users" && (
            <div className="users-tab">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={5} className="empty-row">No users yet</td></tr>
                    ) : users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="user-cell">
                            <img src={u.avatar} alt={u.name} className="user-cell__avatar" />
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`table-badge ${u.role === "admin" ? "status-delivered" : "status-processing"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="table-sub">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="actions-cell">
                          <button
                            className="action-btn"
                            title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                            onClick={() => handleRoleToggle(u._id, u.role)}
                          >
                            {u.role === "admin" ? <IoCloseCircle size={18} /> : <IoCheckmarkCircle size={18} />}
                          </button>
                          <button
                            className="action-btn danger"
                            title="Delete user"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            <IoTrashOutline size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === "products" && (
            <div className="products-tab">
              <div className="admin-info-box">
                <p>Products are managed via the REST API. Use <strong>Postman</strong> to:</p>
                <ul>
                  <li>GET <code>/api/products</code> — list all products (public)</li>
                  <li>POST <code>/api/products</code> — create (admin JWT required)</li>
                  <li>PUT <code>/api/products/:id</code> — update (admin JWT required)</li>
                  <li>DELETE <code>/api/products/:id</code> — delete (admin JWT required)</li>
                </ul>
                <p>Run <code>npm run seed</code> in <code>server/</code> to populate 16 products into MongoDB.</p>
              </div>
              <div className="admin-api-card">
                <h3>Quick Postman Reference</h3>
                <div className="api-rows">
                  {[
                    { method: "POST", url: "/api/auth/login",      note: "Body: {email, password} → returns token" },
                    { method: "GET",  url: "/api/products",         note: "List all — public" },
                    { method: "GET",  url: "/api/admin/dashboard",  note: "Auth: Bearer token (admin)" },
                    { method: "GET",  url: "/api/admin/orders",     note: "Auth: Bearer token (admin)" },
                    { method: "PUT",  url: "/api/admin/orders/:id/status", note: "Body: {status}" },
                    { method: "GET",  url: "/api/admin/users",      note: "Auth: Bearer token (admin)" },
                  ].map((r) => (
                    <div key={r.url} className="api-row">
                      <span className={`method-badge method-${r.method.toLowerCase()}`}>{r.method}</span>
                      <code className="api-url">{r.url}</code>
                      <span className="api-note">{r.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
