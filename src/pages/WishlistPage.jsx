import { Link } from "react-router-dom";
import { IoHeartOutline, IoArrowForward } from "react-icons/io5";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/product/ProductCard";
import "./WishlistPage.css";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (wishlistItems.length === 0) {
    return (
      <div className="page-wrapper wishlist-page">
        <div className="container">
          <h1 className="page-title">My Wishlist</h1>
          <div className="wishlist-empty">
            <IoHeartOutline size={64} className="wishlist-empty__icon" />
            <h2>Your wishlist is empty</h2>
            <p>Save your favourite products here to shop them later.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Browse Products <IoArrowForward />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1 className="page-title">
            My Wishlist <span className="wishlist-count">({wishlistItems.length})</span>
          </h1>
          <button
            className="wishlist-add-all-btn btn btn-outline"
            onClick={() => {
              wishlistItems.forEach((item) => addToCart(item));
              toast.success("All wishlist items added to cart!");
            }}
          >
            Add All to Cart
          </button>
        </div>
        <div className="grid-auto">
          {wishlistItems.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
