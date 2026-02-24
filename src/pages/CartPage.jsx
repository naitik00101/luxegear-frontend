import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoTrashOutline,
  IoArrowForward,
  IoTicketOutline,
  IoCloseCircle,
  IoCartOutline,
} from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/formatCurrency";
import Modal from "../components/ui/Modal";
import "./CartPage.css";

const CartPage = () => {
  const {
    cartItems, itemCount, subtotal, discountAmount, shipping, total,
    couponCode, appliedDiscount,
    removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    await new Promise((r) => setTimeout(r, 600));
    const result = applyCoupon(couponInput.trim());
    if (result.success) {
      toast.success(`Coupon applied! ${result.discount}% off your order.`);
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code. Try LUXE20, GEAR10, or SAVE15.");
    }
    setCouponLoading(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper cart-page">
        <div className="container">
          <h1 className="page-title">Your Cart</h1>
          <div className="cart-empty">
            <span className="cart-empty__icon"><IoCartOutline size={64} /></span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="page-title">Your Cart <span className="cart-header-count">({itemCount} items)</span></h1>
          <button className="clear-cart-btn" onClick={() => { clearCart(); toast.info("Cart cleared."); }}>
            Clear all
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <Link to={`/product/${item.id}`} className="cart-item__img-wrap">
                  <img src={item.images[0]} alt={item.name} className="cart-item__img" />
                </Link>
                <div className="cart-item__info">
                  <span className="cart-item__category">{item.category}</span>
                  <Link to={`/product/${item.id}`} className="cart-item__name">{item.name}</Link>
                  <div className="cart-item__price-row">
                    <span className="cart-item__price">{formatCurrency(item.price)}</span>
                    {item.originalPrice > item.price && (
                      <span className="cart-item__original">{formatCurrency(item.originalPrice)}</span>
                    )}
                  </div>
                </div>
                <div className="cart-item__controls">
                  <div className="qty-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                  </div>
                  <span className="cart-item__subtotal">{formatCurrency(item.price * item.quantity)}</span>
                  <button
                    className="cart-item__remove"
                    onClick={() => { removeFromCart(item.id); toast.info(`${item.name} removed.`); }}
                    aria-label="Remove"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="coupon-section">
              {couponCode ? (
                <div className="coupon-applied">
                  <IoTicketOutline size={18} />
                  <span><strong>{couponCode}</strong> — {appliedDiscount}% off</span>
                  <button onClick={() => { removeCoupon(); toast.info("Coupon removed."); }}>
                    <IoCloseCircle size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="coupon-input-row">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                      className="coupon-input"
                      onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
                    />
                    <button className="coupon-btn" onClick={handleCoupon} disabled={couponLoading || !couponInput.trim()}>
                      {couponLoading ? "…" : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="coupon-error">{couponError}</p>}
                  <p className="coupon-hint">Try: LUXE20 · GEAR10 · SAVE15</p>
                </>
              )}
            </div>

            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-line summary-line--discount">
                  <span>Coupon ({appliedDiscount}% off)</span>
                  <span>−{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Shipping</span>
                <span className={shipping === 0 ? "free-shipping" : ""}>
                  {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="free-shipping-hint">
                  Add {formatCurrency(150 - subtotal + discountAmount)} more for free shipping!
                </p>
              )}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <button
              className="btn btn-primary checkout-btn"
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/checkout");
                } else {
                  setShowAuthModal(true);
                }
              }}
            >
              Proceed to Checkout <IoArrowForward size={18} />
            </button>

            <Link to="/shop" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Authentication Required"
        size="sm"
      >
        <div className="auth-prompt-modal">
          <p>Please sign in or create an account to complete your purchase.</p>
          <div className="auth-prompt-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/auth?redirect=/checkout")}
            >
              Sign In
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/auth?tab=register&redirect=/checkout")}
            >
              Create Account
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage;
