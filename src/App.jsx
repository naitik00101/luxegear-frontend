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
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import AIChat from "./components/features/AIChat";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
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
  const hideLayout = pathname === "/auth" || pathname.startsWith("/admin");

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
          <Route path="/auth"        element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout"         element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/profile"          element={<ProfilePage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login"      element={<AdminLoginPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin"            element={<AdminPage />} />
          </Route>

          <Route path="*"            element={<NotFoundPage />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      <AIChat />
      <Toast />
    </>
  );
};

export default App;
