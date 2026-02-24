const BASE = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("luxegear-token");

const headers = (extra = {}) => ({
    "Content-Type": "application/json",
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...extra,
});

const request = async (path, options = {}) => {
    const res = await fetch(`${BASE}${path}`, { ...options, headers: headers(options.headers) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
};

export const authAPI = {
    register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => request("/api/auth/me"),
    update: (body) => request("/api/auth/me", { method: "PUT", body: JSON.stringify(body) }),
};

export const productsAPI = {
    getAll: (params = {}) => request(`/api/products?${new URLSearchParams(params)}`),
    getFeatured: () => request("/api/products/featured"),
    getById: (id) => request(`/api/products/${id}`),
    create: (body) => request("/api/products", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id) => request(`/api/products/${id}`, { method: "DELETE" }),
};

export const ordersAPI = {
    place: (body) => request("/api/orders", { method: "POST", body: JSON.stringify(body) }),
    myOrders: () => request("/api/orders/my"),
    getById: (id) => request(`/api/orders/${id}`),
};

export const adminAPI = {
    dashboard: () => request("/api/admin/dashboard"),
    getOrders: (params = {}) => request(`/api/admin/orders?${new URLSearchParams(params)}`),
    updateStatus: (id, status) => request(`/api/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
    getUsers: (params = {}) => request(`/api/admin/users?${new URLSearchParams(params)}`),
    updateRole: (id, role) => request(`/api/admin/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) }),
    deleteUser: (id) => request(`/api/admin/users/${id}`, { method: "DELETE" }),
};
