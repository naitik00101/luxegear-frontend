import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/layout/AdminNavbar";
import {
  IoGridOutline, IoCubeOutline, IoReceiptOutline,
  IoPeopleOutline, IoCheckmarkCircle, IoCloseCircle,
  IoTrashOutline, IoRefreshOutline, IoShieldOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { adminAPI, productsAPI } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import Spinner from "../components/ui/Spinner";
import "./AdminPage.css";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: <IoGridOutline size={18} /> },
  { key: "products",  label: "Products",  icon: <IoCubeOutline size={18} /> },
  { key: "orders",    label: "Orders",    icon: <IoReceiptOutline size={18} /> },
  { key: "users",     label: "Users",     icon: <IoPeopleOutline size={18} /> },
];

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tab, setTab]           = useState("dashboard");
  const [stats, setStats]       = useState(null);
  const [orders, setOrders]     = useState([]);
  const [users, setUsers]       = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  
  // Product Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "", category: "headphones", price: 0, stock: 0, 
    description: "", images: ["", "", ""], tags: ""
  });

  useEffect(() => {
    if (!isAuthenticated) { navigate("/auth"); return; }
    if (user?.role !== "admin") { navigate("/"); toast.error("Admin access required."); }
  }, [isAuthenticated, user, navigate, toast]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const { stats: s } = await adminAPI.dashboard();
      setStats(s);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [toast]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { orders: o } = await adminAPI.getOrders({ limit: 50 });
      setOrders(o);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [toast]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { users: u } = await adminAPI.getUsers({ limit: 50 });
      setUsers(u);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [toast]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsAPI.getAll();
      setProducts(data.products || data);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => {
    if (tab === "dashboard") loadDashboard();
    else if (tab === "orders") loadOrders();
    else if (tab === "users") loadUsers();
    else if (tab === "products") loadProducts();
  }, [tab, loadDashboard, loadOrders, loadUsers, loadProducts]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await adminAPI.updateStatus(orderId, status);
      toast.success("Order updated");
      loadOrders();
    } catch (e) { toast.error(e.message); }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await adminAPI.updateRole(userId, role);
      toast.success(`Identity Revised: User elevated to ${role}.`);
      loadUsers();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleOpenModal = (p = null) => {
    if (p) {
      setEditingProduct(p);
      setProductForm({
        name: p.name, category: p.category, price: p.price, stock: p.stock,
        description: p.description, images: [...p.images], 
        tags: Array.isArray(p.tags) ? p.tags.join(", ") : ""
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "", category: "headphones", price: 0, stock: 0, 
        description: "", images: ["", "", ""], tags: ""
      });
    }
    setShowModal(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const data = { 
      ...productForm, 
      tags: productForm.tags.split(",").map(t => t.trim()).filter(Boolean)
    };
    try {
      if (editingProduct) await productsAPI.update(editingProduct._id, data);
      else await productsAPI.create(data);
      toast.success(editingProduct ? "Product updated" : "Product created");
      setShowModal(false);
      loadProducts();
    } catch (e) { toast.error(e.message); }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(id);
      toast.success("Product deleted");
      loadProducts();
    } catch (e) { toast.error(e.message); }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Delete user?")) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success("User deleted");
      loadUsers();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="admin-page-wrapper">
      <AdminNavbar />
      <div className="admin-page">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1 className="admin-title">Command Center</h1>
              <p className="admin-subtitle">Inventory & Identity Oversight</p>
            </div>
            <button className="admin-refresh-btn" onClick={() => {
               if (tab === "dashboard") loadDashboard();
               else if (tab === "orders") loadOrders();
               else if (tab === "users") loadUsers();
               else loadProducts();
            }}>Force Sync</button>
          </div>

          <div className="admin-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`admin-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="admin-content">
            {loading && <div className="admin-loader"><Spinner size="xl" /></div>}

            {!loading && tab === "dashboard" && stats && (
              <div className="dashboard-tab">
                <div className="stat-cards">
                  <div className="stat-card">
                    <p className="stat-card__value">{formatCurrency(stats.revenue)}</p>
                    <p className="stat-card__label">Total Revenue</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-card__value">{stats.totalOrders}</p>
                    <p className="stat-card__label">Total Orders</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-card__value">{stats.pendingOrders}</p>
                    <p className="stat-card__label">Pending</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-card__value">{stats.totalProducts}</p>
                    <p className="stat-card__label">Inventory</p>
                  </div>
                </div>
              </div>
            )}

            {!loading && tab === "products" && (
              <div className="products-tab">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom: '20px'}}>
                  <h2 style={{fontWeight:300}}>Products</h2>
                  <button className="elite-btn-gold" onClick={() => handleOpenModal()}>+ Add Item</button>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td><img src={p.images[0]} className="table-img" alt="" /></td>
                        <td>{p.name}</td>
                        <td>{formatCurrency(p.price)}</td>
                        <td>{p.stock}</td>
                        <td>
                          <button className="elite-btn-sm" onClick={() => handleOpenModal(p)}>Edit</button>
                          <button className="elite-btn-sm danger" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && tab === "orders" && (
              <div className="orders-tab">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ref</th>
                      <th>Client</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td style={{fontFamily:'monospace'}}>#{o._id.slice(-6).toUpperCase()}</td>
                        <td>{o.user?.name || "Guest"}</td>
                        <td>{formatCurrency(o.total)}</td>
                        <td><span style={{color: o.status === 'delivered' ? '#D4AF37' : '#888'}}>{o.status}</span></td>
                        <td>
                          <select className="elite-select" value={o.status} onChange={(e) => handleUpdateStatus(o._id, e.target.value)}>
                            {["pending","processing","shipped","delivered","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && tab === "users" && (
              <div className="users-tab">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Identity</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Management</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <div style={{display:'flex', gap:'10px'}}>
                            <select 
                              className="elite-select-sm" 
                              value={u.role} 
                              onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                              disabled={u._id === user._id}
                            >
                              <option value="user">USER</option>
                              <option value="admin">ADMIN</option>
                            </select>
                            <button 
                              className="elite-btn-sm danger" 
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={u._id === user._id}
                            >
                              Terminate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 style={{fontWeight:300, marginBottom: '20px'}}>{editingProduct ? "Revise Asset" : "New Asset"}</h3>
                <form onSubmit={handleSubmitProduct} className="elite-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                  </div>
                  <div style={{display:'flex', gap:'20px'}}>
                    <div className="form-group" style={{flex:1}}>
                      <label>Price</label>
                      <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                    </div>
                    <div className="form-group" style={{flex:1}}>
                      <label>Stock</label>
                      <input type="number" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows="3" required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input required value={productForm.images[0]} onChange={e => {
                      const imgs = [...productForm.images];
                      imgs[0] = e.target.value;
                      setProductForm({...productForm, images: imgs});
                    }} />
                  </div>
                  <div style={{display:'flex', gap:'20px', marginTop:'10px'}}>
                    <button type="button" onClick={() => setShowModal(false)} style={{flex:1, border:'1px solid #333', color:'#888', padding:'12px'}}>Abort</button>
                    <button type="submit" className="elite-btn-gold" style={{flex:1, padding:'12px'}}>Commit</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
