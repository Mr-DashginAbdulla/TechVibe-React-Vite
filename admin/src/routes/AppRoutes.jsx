import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Products = lazy(() => import("@/pages/Products"));
const ProductForm = lazy(() => import("@/pages/ProductForm"));
const Categories = lazy(() => import("@/pages/Categories"));
const Orders = lazy(() => import("@/pages/Orders"));
const OrderDetail = lazy(() => import("@/pages/OrderDetail"));
const Users = lazy(() => import("@/pages/Users"));
const Reviews = lazy(() => import("@/pages/Reviews"));
const Brands = lazy(() => import("@/pages/Brands"));
const Settings = lazy(() => import("@/pages/Settings"));
const PromoCodes = lazy(() => import("@/pages/PromoCodes"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="users" element={<Users />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="brands" element={<Brands />} />
            <Route path="settings" element={<Settings />} />
            <Route path="promo-codes" element={<PromoCodes />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
