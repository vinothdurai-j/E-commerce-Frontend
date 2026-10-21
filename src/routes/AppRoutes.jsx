import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

const Home = lazy(() => import("@/pages/Home"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderSuccess = lazy(() => import("@/pages/OrderSuccess"));
const Orders = lazy(() => import("@/pages/Orders"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const Profile = lazy(() => import("@/pages/Profile"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));

const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const ManageProducts = lazy(() => import("@/pages/admin/ManageProducts"));
const ManageOrders = lazy(() => import("@/pages/admin/ManageOrders"));
const ManageCoupons = lazy(() => import("@/pages/admin/ManageCoupons"));

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center text-muted">Loading...</div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public + user pages */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PRODUCTS} element={<Products />} />
          <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetails />} />
          <Route path={ROUTES.CART} element={<Cart />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
            <Route path={ROUTES.ORDER_SUCCESS} element={<OrderSuccess />} />
            <Route path={ROUTES.ORDERS} element={<Orders />} />
            <Route path={ROUTES.WISHLIST} element={<Wishlist />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
          </Route>
        </Route>

        {/* Auth pages */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        </Route>

        {/* Admin pages */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN} element={<Dashboard />} />
            <Route path={ROUTES.ADMIN_PRODUCTS} element={<ManageProducts />} />
            <Route path={ROUTES.ADMIN_ORDERS} element={<ManageOrders />} />
            <Route path={ROUTES.ADMIN_COUPONS} element={<ManageCoupons />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}