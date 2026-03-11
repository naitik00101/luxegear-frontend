const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const BASE = isLocal ? "http://localhost:5000" : import.meta.env.VITE_API_URL;

const TOKEN_KEY = "luxegear-token";
const REFRESH_KEY = "luxegear-refresh-token";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

const headers = (extra = {}) => ({
    "Content-Type": "application/json",
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...extra,
});

// ── Token refresh logic ────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
    refreshQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    refreshQueue = [];
};

const tryRefreshToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const res = await fetch(`${BASE}/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
        // Refresh failed — clear everything
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem("luxegear-user");
        window.location.href = "/login";
        throw new Error("Session expired. Please log in again");
    }

    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_KEY, data.refreshToken);
    return data.accessToken;
};

// ── Core request function with automatic token refresh ─────────────────
const request = async (path, options = {}, _isRetry = false) => {
    const res = await fetch(`${BASE}${path}`, { ...options, headers: headers(options.headers) });

    // If 401 and not a retry, try refreshing the token
    if (res.status === 401 && !_isRetry && getRefreshToken()) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const newToken = await tryRefreshToken();
                isRefreshing = false;
                processQueue(null, newToken);
            } catch (err) {
                isRefreshing = false;
                processQueue(err);
                throw err;
            }
        }

        // Wait for the refresh to complete if another request triggered it
        return new Promise((resolve, reject) => {
            refreshQueue.push({
                resolve: () => resolve(request(path, options, true)),
                reject,
            });

            // If we just finished refreshing, process immediately
            if (!isRefreshing) {
                processQueue(null, getToken());
            }
        });
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
};

// ── Auth API ───────────────────────────────────────────────────────────
export const authAPI = {
    register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => request("/api/auth/me"),
    update: (body) => request("/api/auth/me", { method: "PUT", body: JSON.stringify(body) }),
    refreshToken: (refreshToken) =>
        request("/api/auth/refresh-token", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        }),
    logout: (refreshToken) =>
        request("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        }),
    changePassword: (currentPassword, newPassword) =>
        request("/api/auth/change-password", {
            method: "PUT",
            body: JSON.stringify({ currentPassword, newPassword }),
        }),
};

// ── Products API ───────────────────────────────────────────────────────
export const productsAPI = {
    getAll: (params = {}) => request(`/api/products?${new URLSearchParams(params)}`),
    getFeatured: () => request("/api/products/featured"),
    getById: (id) => request(`/api/products/${id}`),
    create: (body) => request("/api/products", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id) => request(`/api/products/${id}`, { method: "DELETE" }),
};

// ── Orders API ─────────────────────────────────────────────────────────
export const ordersAPI = {
    place: (body) => request("/api/orders", { method: "POST", body: JSON.stringify(body) }),
    myOrders: () => request("/api/orders/my"),
    getById: (id) => request(`/api/orders/${id}`),
};

// ── Admin API ──────────────────────────────────────────────────────────
export const adminAPI = {
    dashboard: () => request("/api/admin/dashboard"),
    getOrders: (params = {}) => request(`/api/admin/orders?${new URLSearchParams(params)}`),
    updateStatus: (id, status) => request(`/api/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
    getUsers: (params = {}) => request(`/api/admin/users?${new URLSearchParams(params)}`),
    updateRole: (id, role) => request(`/api/admin/users/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) }),
    deleteUser: (id) => request(`/api/admin/users/${id}`, { method: "DELETE" }),
};
