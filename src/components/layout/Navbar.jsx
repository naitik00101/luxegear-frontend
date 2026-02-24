import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  IoSearch,
  IoCartOutline,
  IoHeartOutline,
  IoPersonOutline,
  IoMenu,
  IoClose,
  IoChevronDown,
  IoLogOutOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import useDebounce from "../../hooks/useDebounce";
import "./Navbar.css";

const Navbar = () => {
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (debouncedSearch.trim() && location.pathname === "/shop") {
      navigate(`/shop?search=${encodeURIComponent(debouncedSearch)}`);
    }
  }, [debouncedSearch, navigate, location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/shop") {
      setSearchQuery("");
      setSearchOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner container">
          <Link to="/" className="navbar__logo">
            <span className="logo-text">
              Luxe<span className="logo-accent">Gear</span>
            </span>
          </Link>

          <nav className="navbar__nav">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Shop
            </NavLink>
            <NavLink to="/shop?category=headphones" className="nav-link">
              Audio
            </NavLink>
            <NavLink to="/shop?category=keyboards" className="nav-link">
              Keyboards
            </NavLink>
            <NavLink to="/shop?category=monitors" className="nav-link">
              Monitors
            </NavLink>
          </nav>

          <div className="navbar__actions">
            <button
              className="navbar__icon-btn"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
            >
              {searchOpen ? <IoClose size={22} /> : <IoSearch size={22} />}
            </button>

            <Link to="/wishlist" className="navbar__icon-btn" aria-label="Wishlist">
              <IoHeartOutline size={22} />
              {wishlistItems.length > 0 && (
                <span className="navbar__badge">{wishlistItems.length}</span>
              )}
            </Link>

            <Link to="/cart" className="navbar__icon-btn" aria-label="Cart">
              <IoCartOutline size={22} />
              {itemCount > 0 && (
                <span className="navbar__badge navbar__badge--cart">{itemCount}</span>
              )}
            </Link>

            <div className="navbar__user" ref={userMenuRef}>
              <button
                className="navbar__icon-btn"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label="User menu"
              >
                {isAuthenticated ? (
                  <img src={user.avatar} alt={user.name} className="navbar__avatar" />
                ) : (
                  <IoPersonOutline size={22} />
                )}
                <IoChevronDown size={14} className={`chevron ${userMenuOpen ? "rotated" : ""}`} />
              </button>
              {userMenuOpen && (
                <div className="navbar__user-menu">
                  {isAuthenticated ? (
                    <>
                      <div className="user-menu__header">
                        <img src={user.avatar} alt={user.name} className="user-menu__avatar" />
                        <div>
                          <p className="user-menu__name">{user.name}</p>
                          <p className="user-menu__email">{user.email}</p>
                        </div>
                      </div>
                      <Link to="/profile" className="user-menu__item" onClick={() => setUserMenuOpen(false)}>
                        <IoPersonCircleOutline size={18} /> My Profile
                      </Link>
                      <button
                        className="user-menu__item user-menu__logout"
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                      >
                        <IoLogOutOutline size={18} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth" className="user-menu__item" onClick={() => setUserMenuOpen(false)}>
                        Sign In
                      </Link>
                      <Link to="/auth?tab=register" className="user-menu__item" onClick={() => setUserMenuOpen(false)}>
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="navbar__icon-btn navbar__hamburger"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
            </button>
          </div>
        </div>

        <div className={`navbar__search-bar ${searchOpen ? "open" : ""}`}>
          <form onSubmit={handleSearchSubmit} className="container">
            <div className="search-input-wrap">
              <IoSearch size={20} className="search-icon" />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search headphones, keyboards, monitors…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="search-clear">
                  <IoClose size={18} />
                </button>
              )}
            </div>
          </form>
        </div>
      </header>

      <aside className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <nav className="mobile-menu__nav">
          <NavLink to="/" onClick={closeMobile} end>Home</NavLink>
          <NavLink to="/shop" onClick={closeMobile}>Shop All</NavLink>
          <NavLink to="/shop?category=headphones" onClick={closeMobile}>Audio</NavLink>
          <NavLink to="/shop?category=keyboards" onClick={closeMobile}>Keyboards</NavLink>
          <NavLink to="/shop?category=monitors" onClick={closeMobile}>Monitors</NavLink>
          <NavLink to="/wishlist" onClick={closeMobile}>Wishlist ({wishlistItems.length})</NavLink>
          <NavLink to="/cart" onClick={closeMobile}>Cart ({itemCount})</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" onClick={closeMobile}>My Profile</NavLink>
              <button onClick={() => { logout(); closeMobile(); }} className="mobile-menu__logout">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/auth" onClick={closeMobile}>Sign In / Register</NavLink>
          )}
        </nav>
      </aside>
      {mobileOpen && <div className="mobile-overlay" onClick={closeMobile} />}
    </>
  );
};

export default Navbar;
