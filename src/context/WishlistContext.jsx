/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useLocalStorage("luxegear-wishlist", []);

  const toggleWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      return exists
        ? prev.filter((item) => item._id !== product._id)
        : [...prev, product];
    });
  }, [setWishlistItems]);

  const isWishlisted = useCallback(
    (productId) => wishlistItems.some((item) => item._id === productId),
    [wishlistItems]
  );

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  }, [setWishlistItems]);

  const value = useMemo(
    () => ({ wishlistItems, toggleWishlist, isWishlisted, removeFromWishlist }),
    [wishlistItems, toggleWishlist, isWishlisted, removeFromWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

export default WishlistContext;
