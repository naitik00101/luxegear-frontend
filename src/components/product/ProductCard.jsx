import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoHeartOutline,
  IoHeart,
  IoCartOutline,
  IoEyeOutline,
} from "react-icons/io5";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { formatCurrency, getDiscountPercent } from "../../utils/formatCurrency";
import StarRating from "./StarRating";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsAdding(true);
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
      await new Promise((r) => setTimeout(r, 600));
      setIsAdding(false);
    },
    [addToCart, product, toast]
  );

  const handleWishlist = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(product);
      toast.info(
        wishlisted ? "Removed from wishlist" : `${product.name} added to wishlist!`
      );
    },
    [toggleWishlist, product, wishlisted, toast]
  );

  const discount = getDiscountPercent(product.price, product.originalPrice);

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__link">
        {/* Badges */}
        <div className="product-card__badges">
          {product.newArrival && <span className="badge badge-new">New</span>}
          {product.isSale && discount > 0 && (
            <span className="badge badge-sale">-{discount}%</span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="badge badge-low">Low Stock</span>
          )}
          {product.stock === 0 && (
            <span className="badge badge-out">Out of Stock</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`product-card__wishlist ${wishlisted ? "wishlisted" : ""}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
        </button>

        {/* Image */}
        <div className="product-card__image-wrap">
          {!imgLoaded && <div className="skeleton product-card__skeleton" />}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`product-card__image ${imgLoaded ? "loaded" : ""}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
          {/* Hover overlay */}
          <div className="product-card__overlay">
            <button
              className="overlay-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/product/${product.id}`);
              }}
              aria-label="Quick view"
            >
              <IoEyeOutline size={18} /> Quick View
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="product-card__info">
          <p className="product-card__category">{product.category}</p>
          <h3 className="product-card__name">{product.name}</h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <div className="product-card__price-row">
            <div className="product-card__prices">
              <span className="product-card__price">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="product-card__original">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <button
              className={`product-card__add-btn ${isAdding ? "adding" : ""}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              aria-label="Add to cart"
            >
              {isAdding ? (
                <span className="add-check">✓</span>
              ) : (
                <IoCartOutline size={20} />
              )}
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
