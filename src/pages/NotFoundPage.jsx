import { Link } from "react-router-dom";
import { IoHomeOutline, IoArrowBack } from "react-icons/io5";
import "./NotFoundPage.css";

const NotFoundPage = () => (
  <div className="page-wrapper notfound-page">
    <div className="notfound-inner">
      <div className="notfound-glow" />
      <h1 className="notfound-code">404</h1>
      <h2 className="notfound-title">Page Not Found</h2>
      <p className="notfound-sub">Looks like this page got lost in the tech abyss.</p>
      <div className="notfound-actions">
        <Link to="/" className="btn btn-primary btn-lg">
          <IoHomeOutline size={20} /> Go Home
        </Link>
        <Link to="/shop" className="btn btn-outline btn-lg">
          <IoArrowBack size={20} /> Back to Shop
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
