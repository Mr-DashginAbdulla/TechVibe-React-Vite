import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const Home = lazy(() => import("@/pages/public/Home/Home"));
const Shop = lazy(() => import("@/pages/public/Shop/Shop"));
const Deals = lazy(() => import("@/pages/public/Deals/Deals"));
const ProductDetails = lazy(
  () => import("@/pages/public/Products/ProductDetails"),
);
const Checkout = lazy(() => import("@/pages/public/Checkout/Checkout"));
const OrderSuccess = lazy(
  () => import("@/pages/public/OrderSuccess/OrderSuccess"),
);

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetSuccess = lazy(() => import("@/pages/auth/ResetSuccess"));
const AuthWelcome = lazy(() => import("@/pages/auth/AuthWelcome"));

const ProfileLayout = lazy(() => import("@/pages/profile/ProfileLayout"));
const ProfileOverview = lazy(
  () => import("@/pages/profile/ProfileOverview/ProfileOverview"),
);
const AccountSettings = lazy(
  () => import("@/pages/profile/AccountSettings/AccountSettings"),
);
const MyAddresses = lazy(
  () => import("@/pages/profile/MyAddresses/MyAddresses"),
);
const MyOrders = lazy(() => import("@/pages/profile/MyOrders"));
const OrderDetails = lazy(
  () => import("@/pages/profile/OrderDetails/OrderDetails"),
);
const MyWishlist = lazy(() => import("@/pages/profile/MyWishlist"));
const ProfileCart = lazy(() => import("@/pages/profile/ProfileCart"));

// Static pages
const Contact = lazy(() => import("@/pages/public/Contact/Contact"));
const FAQ = lazy(() => import("@/pages/public/FAQ/FAQ"));
const Shipping = lazy(() => import("@/pages/public/Shipping/Shipping"));
const Returns = lazy(() => import("@/pages/public/Returns/Returns"));
const About = lazy(() => import("@/pages/public/About/About"));
const Careers = lazy(() => import("@/pages/public/Careers/Careers"));
const Press = lazy(() => import("@/pages/public/Press/Press"));
const Blog = lazy(() => import("@/pages/public/Blog/Blog"));
const Privacy = lazy(() => import("@/pages/public/Privacy/Privacy"));
const Terms = lazy(() => import("@/pages/public/Terms/Terms"));
const Cookies = lazy(() => import("@/pages/public/Cookies/Cookies"));
const Categories = lazy(() => import("@/pages/public/Categories/Categories"));
const NotFound = lazy(() => import("@/pages/public/NotFound/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route
            path="/basket"
            element={<Navigate to="/profile/cart" replace />}
          />

          {/* Support pages */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />

          {/* Company pages */}
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/blog" element={<Blog />} />

          {/* Legal pages */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
        </Route>

        <Route path="/auth">
          <Route index element={<AuthWelcome />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-success" element={<ResetSuccess />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          </Route>
          <Route path="/profile">
            <Route element={<ProfileLayout />}>
              <Route index element={<ProfileOverview />} />
              <Route path="overview" element={<ProfileOverview />} />
              <Route path="settings" element={<AccountSettings />} />
              <Route path="addresses" element={<MyAddresses />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="wishlist" element={<MyWishlist />} />
              <Route path="cart" element={<ProfileCart />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
