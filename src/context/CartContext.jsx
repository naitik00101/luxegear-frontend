import { createContext, useContext, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const CartContext = createContext(null);

const COUPONS = {
  LUXE20: 20,
  GEAR10: 10,
  SAVE15: 15,
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useLocalStorage("luxegear-cart", []);
  const [couponCode, setCouponCode] = useLocalStorage("luxegear-coupon", "");
  const [appliedDiscount, setAppliedDiscount] = useLocalStorage("luxegear-discount", 0);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, [setCartItems]);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, [setCartItems]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [setCartItems, removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCouponCode("");
    setAppliedDiscount(0);
  }, [setCartItems, setCouponCode, setAppliedDiscount]);

  const applyCoupon = useCallback((code) => {
    const upper = code.toUpperCase().trim();
    if (COUPONS[upper]) {
      setCouponCode(upper);
      setAppliedDiscount(COUPONS[upper]);
      return { success: true, discount: COUPONS[upper] };
    }
    return { success: false };
  }, [setCouponCode, setAppliedDiscount]);

  const removeCoupon = useCallback(() => {
    setCouponCode("");
    setAppliedDiscount(0);
  }, [setCouponCode, setAppliedDiscount]);

  const value = useMemo(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = (subtotal * appliedDiscount) / 100;
    const shipping = subtotal > 150 ? 0 : subtotal > 0 ? 9.99 : 0;
    const total = subtotal - discountAmount + shipping;

    return {
      cartItems,
      itemCount,
      subtotal,
      discountAmount,
      shipping,
      total,
      couponCode,
      appliedDiscount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    };
  }, [cartItems, couponCode, appliedDiscount, addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export default CartContext;
