import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

import Home from "@/pages/public/Home/Home";
import ProductDetails from "@/pages/public/Products/ProductDetails";
import Basket from "@/pages/public/Basket/Basket";
import Checkout from "@/pages/public/Checkout/Checkout";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import VerifyCode from "@/pages/auth/VerifyCode";
import ResetSuccess from "@/pages/auth/ResetSuccess";
import AuthWelcome from "@/pages/auth/AuthWelcome";

import ProfileLayout from "@/pages/profile/ProfileLayout";
import ProfileOverview from "@/pages/profile/ProfileOverview";
import AccountSettings from "@/pages/profile/AccountSettings";
import MyAddresses from "@/pages/profile/MyAddresses";
import MyOrders from "@/pages/profile/MyOrders";
import OrderDetails from "@/pages/profile/OrderDetails";
import MyWishlist from "@/pages/profile/MyWishlist";

const NotFound = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-[16px]">
    <div className="max-w-[520px] text-center">
      <p className="text-[40px] font-bold text-[#111827] mb-[8px]">404</p>
      <p className="text-[16px] text-[#6B7280] mb-[20px]">Page not found.</p>
      <a
        href="/"
        className="inline-flex items-center justify-center px-[16px] py-[10px] rounded-[12px] bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition-colors"
      >
        Go to Home
      </a>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      <Route path="/auth">
        <Route index element={<Navigate to="/auth/login" replace />} />
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
      </Route>

      <Route path="/terms" element={<Navigate to="/" replace />} />
      <Route path="/privacy" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
