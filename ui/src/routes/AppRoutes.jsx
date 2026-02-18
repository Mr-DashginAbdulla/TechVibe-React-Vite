import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
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
const VerifyCode = lazy(() => import("@/pages/auth/VerifyCode"));
const ResetSuccess = lazy(() => import("@/pages/auth/ResetSuccess"));
const AuthWelcome = lazy(() => import("@/pages/auth/AuthWelcome"));

const ProfileLayout = lazy(() => import("@/pages/profile/ProfileLayout"));
const ProfileOverview = lazy(() => import("@/pages/profile/ProfileOverview"));
const AccountSettings = lazy(() => import("@/pages/profile/AccountSettings"));
const MyAddresses = lazy(() => import("@/pages/profile/MyAddresses"));
const MyOrders = lazy(() => import("@/pages/profile/MyOrders"));
const OrderDetails = lazy(() => import("@/pages/profile/OrderDetails"));
const MyWishlist = lazy(() => import("@/pages/profile/MyWishlist"));
const ProfileCart = lazy(() => import("@/pages/profile/ProfileCart"));

import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-[16px]">
      <div className="max-w-[520px] text-center">
        <p className="text-[40px] font-bold text-[#111827] mb-[8px]">404</p>
        <p className="text-[16px] text-[#6B7280] mb-[20px]">
          {t("common.pageNotFound")}
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-[16px] py-[10px] rounded-[12px] bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition-colors"
        >
          {t("common.goToHome")}
        </a>
      </div>
    </div>
  );
};

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route
            path="/basket"
            element={<Navigate to="/profile/cart" replace />}
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        </Route>

        <Route path="/auth">
          <Route index element={<AuthWelcome />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-code" element={<VerifyCode />} />
          <Route path="reset-success" element={<ResetSuccess />} />
          <Route path="welcome" element={<AuthWelcome />} />
        </Route>

        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfileOverview />} />
          <Route path="overview" element={<ProfileOverview />} />
          <Route path="settings" element={<AccountSettings />} />
          <Route path="addresses" element={<MyAddresses />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="wishlist" element={<MyWishlist />} />
          <Route path="cart" element={<ProfileCart />} />
        </Route>

        <Route path="/terms" element={<Navigate to="/" replace />} />
        <Route path="/privacy" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
