import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Toast from "./components/ui/Toast";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const App = () => {
  const { pathname } = useLocation();
  const hideLayout = pathname === "/auth";

  return (
    <>
      <ScrollToTop />
      {!hideLayout && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/shop"        element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart"        element={<CartPage />} />
          <Route path="/wishlist"    element={<WishlistPage />} />
          <Route path="/checkout"    element={<CheckoutPage />} />
          <Route path="/auth"        element={<AuthPage />} />
          <Route path="/profile"     element={<ProfilePage />} />
          <Route path="/admin"       element={<AdminPage />} />
          <Route path="*"            element={<NotFoundPage />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      <Toast />
    </>
  );
};

export default App;
