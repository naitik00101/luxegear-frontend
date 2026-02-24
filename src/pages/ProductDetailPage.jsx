import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  IoCartOutline,
  IoHeartOutline,
  IoHeart,
  IoChevronBack,
  IoChevronForward,
  IoCheckmarkCircle,
  IoShieldCheckmarkOutline,
  IoCarOutline,
  IoStar,
} from "react-icons/io5";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/formatCurrency";
import StarRating from "../components/product/StarRating";
import ProductCard from "../components/product/ProductCard";
import "./ProductDetailPage.css";

const MOCK_REVIEWS = [
  { id: 1, name: "Alex M.", rating: 5, date: "Jan 12, 2025", comment: "Absolutely phenomenal build quality. The audio is crystal clear and the ANC is best-in-class. Worth every penny." },
  { id: 2, name: "Sarah K.", rating: 5, date: "Dec 22, 2024", comment: "I've tried many products in this category and this blows them all away. Fast shipping too!" },
  { id: 3, name: "David L.", rating: 4, date: "Nov 05, 2024", comment: "Very impressed. Setup was a breeze and performance is outstanding. Only minor quibble is the carrying case could be better." },
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = useMemo(() => products.find((p) => p.id === Number(id)), [id]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  if (!product) {
    return (
      <div className="page-wrapper not-found-inline">
        <div className="container">
          <h2>Product not found</h2>
          <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handlePrevImg = () => setActiveImg((i) => (i === 0 ? product.images.length - 1 : i - 1));
  const handleNextImg = () => setActiveImg((i) => (i === product.images.length - 1 ? 0 : i + 1));

  const handleAddToCart = async () => {
    setAdding(true);
    addToCart(product, qty);
    toast.success(`${product.name} (×${qty}) added to cart!`);
    setTimeout(() => setAdding(false), 700);
  };

  return (
    <div className="page-wrapper product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="capitalize">{product.category}</Link>
          <span>/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="detail-grid">
          {/* Gallery */}
          <div className="detail-gallery">
            <div className="gallery-main">
              <button className="gallery-arrow gallery-arrow--prev" onClick={handlePrevImg}><IoChevronBack size={22} /></button>
              <img
                src={product.images[activeImg]}
                alt={`${product.name} view ${activeImg + 1}`}
                className="gallery-main__img"
              />
              <button className="gallery-arrow gallery-arrow--next" onClick={handleNextImg}><IoChevronForward size={22} /></button>
              {discount > 0 && <span className="gallery-discount-badge">-{discount}%</span>}
            </div>
            <div className="gallery-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`gallery-thumb ${i === activeImg ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-rating-row">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
              <span className={`stock-badge ${product.stock === 0 ? "out" : product.stock <= 5 ? "low" : "in"}`}>
                {product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In Stock"}
              </span>
            </div>

            <div className="detail-price-row">
              <span className="detail-price">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="detail-original">{formatCurrency(product.originalPrice)}</span>
              )}
              {discount > 0 && <span className="detail-save">Save {discount}%</span>}
            </div>

            <p className="detail-description">{product.description}</p>

            {/* Tags */}
            <div className="detail-tags">
              {product.tags.map((tag) => (
                <span key={tag} className="detail-tag">#{tag}</span>
              ))}
            </div>

            {/* Qty & Add to Cart */}
            <div className="detail-actions">
              <div className="qty-control">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}>+</button>
              </div>
              <button
                className={`btn btn-primary btn-lg add-cart-btn ${adding ? "adding" : ""}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
              >
                <IoCartOutline size={20} />
                {adding ? "Added ✓" : "Add to Cart"}
              </button>
              <button
                className={`wishlist-btn ${wishlisted ? "wishlisted" : ""}`}
                onClick={() => {
                  toggleWishlist(product);
                  toast.info(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
                }}
                aria-label="Wishlist"
              >
                {wishlisted ? <IoHeart size={22} /> : <IoHeartOutline size={22} />}
              </button>
            </div>

            {/* Perks */}
            <div className="detail-perks">
              <div className="detail-perk"><IoCarOutline size={18} /> Free shipping over $150</div>
              <div className="detail-perk"><IoShieldCheckmarkOutline size={18} /> 2-year warranty</div>
              <div className="detail-perk"><IoCheckmarkCircle size={18} /> 30-day returns</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tab-nav">
            {["description", "specs", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "reviews" && <span className="tab-count"> ({product.reviewCount.toLocaleString()})</span>}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === "description" && (
              <div className="tab-description">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="tab-specs">
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td className="spec-key">{key}</td>
                        <td className="spec-val">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="tab-reviews">
                <div className="reviews-summary">
                  <div className="reviews-score">
                    <span className="score-num">{product.rating}</span>
                    <div>
                      <StarRating rating={product.rating} size="lg" />
                      <p className="score-label">{product.reviewCount.toLocaleString()} reviews</p>
                    </div>
                  </div>
                </div>
                <div className="reviews-list">
                  {MOCK_REVIEWS.map((r) => (
                    <div key={r.id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-avatar">{r.name[0]}</div>
                        <div>
                          <p className="reviewer-name">{r.name}</p>
                          <p className="review-date">{r.date}</p>
                        </div>
                        <div className="review-stars">
                          {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                        </div>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="related-section">
            <h2 className="section-title">Related <span className="text-gradient">Products</span></h2>
            <div className="grid-auto" style={{ marginTop: "var(--space-xl)" }}>
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
