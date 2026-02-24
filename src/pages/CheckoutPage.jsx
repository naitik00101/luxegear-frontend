import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoCheckmarkCircle,
  IoChevronForward,
  IoLockClosedOutline,
} from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/formatCurrency";
import { ordersAPI } from "../services/api";
import "./CheckoutPage.css";

const STEPS = ["Shipping", "Payment", "Confirmed"];

const emptyShipping = { firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "IN" };
const emptyPayment  = { cardName: "", cardNumber: "", expiry: "", cvv: "" };

const CheckoutPage = () => {
  const { cartItems, subtotal, discountAmount, shipping, total, couponCode, appliedDiscount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    ...emptyShipping,
    firstName: user?.name?.split(" ")[0] || "",
    lastName:  user?.name?.split(" ")[1] || "",
    email:     user?.email || "",
  });
  const [paymentData, setPaymentData]   = useState(emptyPayment);
  const [errors, setErrors]             = useState({});
  const [processing, setProcessing]     = useState(false);
  const [orderId, setOrderId]           = useState("");

  const updateShipping = (e) => setShippingData((d) => ({ ...d, [e.target.name]: e.target.value }));
  const updatePayment  = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (name === "expiry") value = value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setPaymentData((d) => ({ ...d, [name]: value }));
  };

  const validateShipping = () => {
    const req = ["firstName", "lastName", "email", "address", "city", "state", "zip"];
    const e = {};
    req.forEach((f) => { if (!shippingData[f].trim()) e[f] = "Required"; });
    if (shippingData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (!paymentData.cardName.trim()) e.cardName = "Required";
    if (paymentData.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Invalid card number";
    if (paymentData.expiry.length < 5) e.expiry = "Invalid expiry";
    if (paymentData.cvv.length < 3) e.cvv = "Invalid CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleShippingNext = () => {
    if (validateShipping()) { setStep(1); window.scrollTo(0, 0); }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    const id = "ORD-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    setOrderId(id);
    clearCart();
    setStep(2);
    setProcessing(false);
    window.scrollTo(0, 0);
  };

  if (cartItems.length === 0 && step < 2) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="page-wrapper checkout-page">
      <div className="container">
        <div className="step-indicator">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-item ${i <= step ? "done" : ""} ${i === step ? "active" : ""}`}>
              <div className="step-circle">
                {i < step ? <IoCheckmarkCircle size={20} /> : <span>{i + 1}</span>}
              </div>
              <span className="step-label">{s}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        {step === 2 ? (
          <div className="order-confirmed">
            <div className="confirmed-icon"><IoCheckmarkCircle size={80} /></div>
            <h1 className="confirmed-title">Order Confirmed!</h1>
            <p className="confirmed-sub">Thank you for shopping with LuxeGear.</p>
            <div className="confirmed-id">
              Order ID: <strong>{orderId}</strong>
            </div>
            <p className="confirmed-msg">
              A confirmation email has been sent to <strong>{shippingData.email}</strong>. Your order will be dispatched within 1–2 business days.
            </p>
            <div className="confirmed-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/shop")}>
                Continue Shopping
              </button>
              {isAuthenticated && (
                <button className="btn btn-outline btn-lg" onClick={() => navigate("/profile")}>
                  View Orders
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="checkout-layout">
            <div className="checkout-form-area">
              {step === 0 && (
                <div className="checkout-section">
                  <h2 className="checkout-section-title">Shipping Information</h2>
                  <div className="form-grid">
                    {[
                      { name: "firstName", label: "First Name", placeholder: "John" },
                      { name: "lastName",  label: "Last Name",  placeholder: "Doe" },
                    ].map(({ name, label, placeholder }) => (
                      <div key={name} className="form-group">
                        <label className="form-label">{label}</label>
                        <input name={name} placeholder={placeholder} value={shippingData[name]} onChange={updateShipping} className={`form-input ${errors[name] ? "error" : ""}`} />
                        {errors[name] && <span className="form-error">{errors[name]}</span>}
                      </div>
                    ))}
                    {[
                      { name: "email",   label: "Email",         placeholder: "john@example.com",  span: 2 },
                      { name: "phone",   label: "Phone",         placeholder: "+91 98765 43210",  span: 2 },
                      { name: "address", label: "Address",       placeholder: "123 Tech Street",    span: 2 },
                      { name: "city",    label: "City",          placeholder: "New York" },
                      { name: "state",   label: "State",         placeholder: "Maharashtra" },
                      { name: "zip",     label: "PIN Code",      placeholder: "400001" },
                      { name: "country", label: "Country",       placeholder: "IN" },
                    ].map(({ name, label, placeholder, span }) => (
                      <div key={name} className={`form-group ${span === 2 ? "form-group--full" : ""}`}>
                        <label className="form-label">{label}</label>
                        <input name={name} placeholder={placeholder} value={shippingData[name]} onChange={updateShipping} className={`form-input ${errors[name] ? "error" : ""}`} />
                        {errors[name] && <span className="form-error">{errors[name]}</span>}
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary btn-lg form-next-btn" onClick={handleShippingNext}>
                    Continue to Payment <IoChevronForward size={18} />
                  </button>
                </div>
              )}

              {step === 1 && (
                <div className="checkout-section">
                  <h2 className="checkout-section-title">Payment Details</h2>
                  <div className="payment-secure-badge">
                    <IoLockClosedOutline size={16} /> SSL Secured Payment
                  </div>
                  <div className="form-grid">
                    <div className="form-group form-group--full">
                      <label className="form-label">Cardholder Name</label>
                      <input name="cardName" placeholder="John Doe" value={paymentData.cardName} onChange={updatePayment} className={`form-input ${errors.cardName ? "error" : ""}`} />
                      {errors.cardName && <span className="form-error">{errors.cardName}</span>}
                    </div>
                    <div className="form-group form-group--full">
                      <label className="form-label">Card Number</label>
                      <input name="cardNumber" placeholder="1234 5678 9012 3456" value={paymentData.cardNumber} onChange={updatePayment} className={`form-input ${errors.cardNumber ? "error" : ""}`} maxLength={19} />
                      {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input name="expiry" placeholder="MM/YY" value={paymentData.expiry} onChange={updatePayment} className={`form-input ${errors.expiry ? "error" : ""}`} maxLength={5} />
                      {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input name="cvv" placeholder="•••" value={paymentData.cvv} onChange={updatePayment} className={`form-input ${errors.cvv ? "error" : ""}`} maxLength={4} />
                      {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                    </div>
                  </div>
                  <div className="form-btn-row">
                    <button className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
                    <button className={`btn btn-primary btn-lg ${processing ? "processing" : ""}`} onClick={handlePlaceOrder} disabled={processing}>
                      {processing ? (
                        <><span className="processing-spinner" /> Processing…</>
                      ) : (
                        <><IoLockClosedOutline size={18} /> Place Order — {formatCurrency(total)}</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-summary">
              <h3 className="summary-title">Order Summary</h3>
              <div className="checkout-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item">
                    <div className="checkout-item__img-wrap">
                      <img src={item.images[0]} alt={item.name} />
                      <span className="checkout-item__qty">{item.quantity}</span>
                    </div>
                    <span className="checkout-item__name">{item.name}</span>
                    <span className="checkout-item__price">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              {couponCode && (
                <div className="checkout-coupon">Coupon <strong>{couponCode}</strong>: −{appliedDiscount}%</div>
              )}
              <div className="summary-lines">
                <div className="summary-line"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                {discountAmount > 0 && <div className="summary-line summary-line--discount"><span>Discount</span><span>−{formatCurrency(discountAmount)}</span></div>}
                <div className="summary-line"><span>Shipping</span><span className={shipping === 0 ? "free-shipping" : ""}>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span></div>
              </div>
              <div className="summary-total"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
