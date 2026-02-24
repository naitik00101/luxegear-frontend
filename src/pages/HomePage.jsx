import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  IoHeadset,
  IoKeypadOutline,
  IoDesktopOutline,
  IoColorWandOutline,
  IoSpeedometerOutline,
  IoGridOutline,
  IoArrowForward,
  IoShieldCheckmarkOutline,
  IoCarOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import products from "../data/products";
import ProductCard from "../components/product/ProductCard";
import "./HomePage.css";

const CATEGORIES = [
  { id: "headphones", label: "Audio", icon: <IoHeadset size={32} />, color: "var(--color-primary)" },
  { id: "keyboards",  label: "Keyboards", icon: <IoKeypadOutline size={32} />, color: "var(--color-secondary)" },
  { id: "monitors",   label: "Monitors", icon: <IoDesktopOutline size={32} />, color: "#43e97b" },
  { id: "mice",       label: "Mice", icon: <IoSpeedometerOutline size={32} />, color: "var(--color-gold)" },
  { id: "accessories",label: "Accessories", icon: <IoColorWandOutline size={32} />, color: "#a78bfa" },
];

const PERKS = [
  { icon: <IoCarOutline size={28} />, title: "Free Shipping", desc: "On orders over $150" },
  { icon: <IoShieldCheckmarkOutline size={28} />, title: "2-Year Warranty", desc: "All products covered" },
  { icon: <IoRefreshOutline size={28} />, title: "30-Day Returns", desc: "Hassle-free returns" },
  { icon: <IoGridOutline size={28} />, title: "Premium Selection", desc: "Curated top-tier gear" },
];

const HomePage = () => {
  const featured = useMemo(() => products.filter((p) => p.isFeatured).slice(0, 4), []);
  const newArrivals = useMemo(() => products.filter((p) => p.newArrival).slice(0, 4), []);
  const sales = useMemo(() => products.filter((p) => p.isSale).slice(0, 4), []);

  return (
    <main className="home-page page-wrapper">
      <section className="hero">
        <div className="hero__bg-effects">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
        </div>
        <div className="hero__content container">
          <div className="hero__text">
            <span className="hero__eyebrow">New Season Drop 2025</span>
            <h1 className="hero__title">
              Gear Up for <br />
              <span className="text-gradient">Peak Performance</span>
            </h1>
            <p className="hero__subtitle">
              Premium tech accessories engineered for professionals who demand nothing but the best. From audiophile headphones to mechanical keyboards — elevate every keystroke and beat.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn-primary btn-lg">
                Shop Collection <IoArrowForward />
              </Link>
              <Link to="/shop?isFeatured=true" className="btn btn-outline btn-lg">
                View Bestsellers
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="stat-num">16+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="hero__stat">
                <span className="stat-num">50K+</span>
                <span className="stat-label">Customers</span>
              </div>
              <div className="hero__stat">
                <span className="stat-num">4.8★</span>
                <span className="stat-label">Avg Rating</span>
              </div>
            </div>
          </div>
          <div className="hero__image-wrap">
            <div className="hero__image-glow" />
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=85"
              alt="Premium SonicPro X1 Headphones"
              className="hero__product-image"
            />
            <div className="hero__floating-card hero__floating-card--1">
              <div>
                <p className="floating-title">Bestseller</p>
                <p className="floating-sub">SonicPro X1</p>
              </div>
            </div>
            <div className="hero__floating-card hero__floating-card--2">
              <div>
                <p className="floating-title">Free Shipping</p>
                <p className="floating-sub">Orders over $150</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hero__scroll-indicator">
          <span />
        </div>
      </section>

      <section className="perks-bar">
        <div className="container">
          <div className="perks-bar__grid">
            {PERKS.map((perk) => (
              <div key={perk.title} className="perk-card">
                <span className="perk-card__icon">{perk.icon}</span>
                <div>
                  <p className="perk-card__title">{perk.title}</p>
                  <p className="perk-card__desc">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by <span className="text-gradient">Category</span></h2>
            <Link to="/shop" className="section-link">View All <IoArrowForward /></Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="category-card"
                style={{ "--cat-color": cat.color }}
              >
                <span className="category-card__icon">{cat.icon}</span>
                <span className="category-card__label">{cat.label}</span>
                <IoArrowForward className="category-card__arrow" size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured <span className="text-gradient">Products</span></h2>
            <Link to="/shop?featured=true" className="section-link">View All <IoArrowForward /></Link>
          </div>
          <div className="grid-auto">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="promo-banner">
        <div className="container">
          <div className="promo-banner__inner">
            <div className="promo-banner__orb" />
            <div className="promo-banner__content">
              <span className="promo-badge">Limited Time</span>
              <h2 className="promo-banner__title">Up to 30% Off Premium Monitors</h2>
              <p className="promo-banner__sub">
                Upgrade your workspace with our 4K and ultrawide monitors at unbeatable prices. Use code{" "}
                <strong>LUXE20</strong> for an extra 20% off your cart.
              </p>
              <Link to="/shop?category=monitors" className="btn btn-primary">
                Shop Monitors <IoArrowForward />
              </Link>
            </div>
            <div className="promo-banner__image">
              <img
                src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"
                alt="Monitor Sale"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New <span className="text-gradient">Arrivals</span></h2>
            <Link to="/shop?newest=true" className="section-link">See More <IoArrowForward /></Link>
          </div>
          <div className="grid-auto">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">On <span className="text-gradient">Sale</span></h2>
            <Link to="/shop?sale=true" className="section-link">View All Deals <IoArrowForward /></Link>
          </div>
          <div className="grid-auto">
            {sales.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
