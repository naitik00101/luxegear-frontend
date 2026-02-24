import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./AuthPage.css";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "register" ? "register" : "login"
  );
  const [loginData, setLoginData]     = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]           = useState({});
  const [showPass, setShowPass]       = useState(false);
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const dest = searchParams.get("redirect") || "/";
      navigate(dest);
    }
  }, [isAuthenticated, navigate, searchParams]);

  const validateLogin = () => {
    const e = {};
    if (!loginData.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) e.email = "Invalid email";
    if (!loginData.password) e.password = "Required";
    else if (loginData.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e = {};
    if (!registerData.name.trim()) e.name = "Required";
    if (!registerData.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(registerData.email)) e.email = "Invalid email";
    if (!registerData.password) e.password = "Required";
    else if (registerData.password.length < 6) e.password = "Min 6 characters";
    if (registerData.confirm !== registerData.password) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      toast.success("Welcome back!");
      const dest = searchParams.get("redirect") || "/";
      navigate(dest);
    } else {
      toast.error("Invalid credentials. Password must be at least 6 characters.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    const result = await register(registerData.name, registerData.email, registerData.password);
    if (result.success) {
      toast.success("Account created! Welcome to LuxeGear!");
      const dest = searchParams.get("redirect") || "/";
      navigate(dest);
    }
  };

  return (
    <div className="page-wrapper auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="text-gradient">LuxeGear</span>
          </div>

          <div className="auth-tabs">
            <button className={`auth-tab ${activeTab === "login" ? "active" : ""}`} onClick={() => { setActiveTab("login"); setErrors({}); }}>
              Sign In
            </button>
            <button className={`auth-tab ${activeTab === "register" ? "active" : ""}`} onClick={() => { setActiveTab("register"); setErrors({}); }}>
              Create Account
            </button>
          </div>

          {activeTab === "login" && (
            <form className="auth-form" onSubmit={handleLogin} noValidate>
              <h2 className="auth-form-title">Welcome back</h2>
              <p className="auth-form-sub">Sign in to your LuxeGear account</p>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData((d) => ({ ...d, email: e.target.value }))}
                  className={`form-input ${errors.email ? "error" : ""}`}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="pass-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData((d) => ({ ...d, password: e.target.value }))}
                    className={`form-input ${errors.password ? "error" : ""}`}
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass((v) => !v)}>
                    {showPass ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
                {isLoading ? <><span className="processing-spinner" /> Signing In…</> : "Sign In"}
              </button>

              <p className="auth-switch">
                Don&apos;t have an account?{" "}
                <button type="button" className="auth-switch-btn" onClick={() => { setActiveTab("register"); setErrors({}); }}>
                  Create one
                </button>
              </p>
            </form>
          )}

          {activeTab === "register" && (
            <form className="auth-form" onSubmit={handleRegister} noValidate>
              <h2 className="auth-form-title">Create account</h2>
              <p className="auth-form-sub">Join LuxeGear for the best tech deals</p>

              {[
                { key: "name",     label: "Full Name",  type: "text",     placeholder: "John Doe" },
                { key: "email",    label: "Email",      type: "email",    placeholder: "you@example.com" },
                { key: "password", label: "Password",   type: "password", placeholder: "Min 6 characters" },
                { key: "confirm",  label: "Confirm Password", type: "password", placeholder: "Repeat password" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={registerData[key]}
                    onChange={(e) => setRegisterData((d) => ({ ...d, [key]: e.target.value }))}
                    className={`form-input ${errors[key] ? "error" : ""}`}
                  />
                  {errors[key] && <span className="form-error">{errors[key]}</span>}
                </div>
              ))}

              <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
                {isLoading ? <><span className="processing-spinner" /> Creating Account…</> : "Create Account"}
              </button>

              <p className="auth-switch">
                Already have an account?{" "}
                <button type="button" className="auth-switch-btn" onClick={() => { setActiveTab("login"); setErrors({}); }}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>

        <div className="auth-promo">
          <h2>Elevate Your Setup.</h2>
          <p>Join 50,000+ tech enthusiasts who trust LuxeGear for premium accessories.</p>
          <ul className="auth-promo-list">
            <li>Exclusive member discounts</li>
            <li>Early access to new drops</li>
            <li>Priority customer support</li>
            <li>Order history & tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
