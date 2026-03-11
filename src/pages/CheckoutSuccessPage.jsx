import { Link, useLocation, Navigate } from "react-router-dom";
import { IoCheckmarkCircleOutline, IoArrowForward, IoBagHandleOutline } from "react-icons/io5";
import "./CheckoutSuccessPage.css";

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) return <Navigate to="/" replace />;

  return (
    <div className="success-page page-wrapper">
      <div className="container success-container">
        <div className="success-card">
          <div className="success-icon-wrap">
            <IoCheckmarkCircleOutline className="success-icon" size={80} />
          </div>
          <p className="success-eyebrow">Transaction Confirmed</p>
          <h1 className="success-title">Elite Asset Secured</h1>
          <p className="success-sub">
            Your order <strong>#{orderId.slice(-6).toUpperCase()}</strong> has been processed. 
            An authentication receipt has been sent to your primary email.
          </p>
          
          <div className="success-actions">
            <Link to="/profile" className="btn btn-gold btn-lg">
              Track Order <IoBagHandleOutline />
            </Link>
            <Link to="/shop" className="btn btn-outline btn-lg">
              Continue Collecting <IoArrowForward />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
