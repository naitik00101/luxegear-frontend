import { Link } from "react-router-dom";
import { IoLogoInstagram, IoLogoTwitter, IoLogoGithub, IoLogoLinkedin, IoFlash } from "react-icons/io5";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              Luxe<span>Gear</span>
            </Link>
            <p className="footer__tagline">
              Elevate your setup with premium tech accessories crafted for performance and style.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="Instagram" className="social-icon"><IoLogoInstagram size={20} /></a>
              <a href="#" aria-label="Twitter" className="social-icon"><IoLogoTwitter size={20} /></a>
              <a href="#" aria-label="GitHub" className="social-icon"><IoLogoGithub size={20} /></a>
              <a href="#" aria-label="LinkedIn" className="social-icon"><IoLogoLinkedin size={20} /></a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Shop</h4>
            <ul className="footer__links">
              <li><Link to="/shop">All Products</Link></li>
              <li><Link to="/shop?category=headphones">Headphones</Link></li>
              <li><Link to="/shop?category=keyboards">Keyboards</Link></li>
              <li><Link to="/shop?category=monitors">Monitors</Link></li>
              <li><Link to="/shop?category=mice">Mice</Link></li>
              <li><Link to="/shop?isSale=true">Sale Items</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Support</h4>
            <ul className="footer__links">
              <li><Link to="#">FAQ</Link></li>
              <li><Link to="#">Shipping Policy</Link></li>
              <li><Link to="#">Returns</Link></li>
              <li><Link to="#">Contact Us</Link></li>
              <li><Link to="#">Track Order</Link></li>
            </ul>
          </div>

          <div className="footer__newsletter">
            <h4 className="footer__heading">Stay in the Loop</h4>
            <p>Subscribe for new drops, tech reviews, and exclusive deals.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} LuxeGear. All rights reserved.</p>
          <div className="footer__payment-icons">
            <span className="payment-badge">VISA</span>
            <span className="payment-badge">MC</span>
            <span className="payment-badge">AMEX</span>
            <span className="payment-badge">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
