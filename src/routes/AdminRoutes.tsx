import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
// import ProtectedRoute from "../components/ProtectedRoute";
import ADMIN_ROUTES, { ROUTES } from "../constants/routes";
import CouponManagement from "@/pages/Admin/AdminCouponManagementPage";



const AdminLoginPage = lazy(() => import("../pages/Admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboardPage"));
const AdminProductsPage = lazy(
  () => import("../pages/Admin/AdminProductsPage")
);
const AdminAddProduct = lazy(
  () => import("../pages/Admin/AdminAddProduct")
);
const AdminEditProduct=lazy(()=>import('../pages/Admin/AdminEditProduct'))
const AdminCategoryPage = lazy(
  () => import("../pages/Admin/AdminCategoryPage")
);
const AdminUserManagement = lazy(
  () => import("../pages/Admin/AdminUserManagement")
);
const AdminOrderMangement = lazy(
  () => import("../pages/Admin/AdminOrderManagement")
);

const AdminRoutes: React.FC = () => (
  <Routes>
    <Route index element={<AdminLoginPage />} />
    <Route element={<AdminLayout />}>
      <Route path={ADMIN_ROUTES.DASHBOARD} element={<AdminDashboard />} />
      <Route path={ADMIN_ROUTES.PRODUCTS}>
        <Route index element={<AdminProductsPage />} />
        <Route path="add" element={<AdminAddProduct />} />
        <Route path=":id" element={<AdminEditProduct/>} />
      </Route>
      <Route path={ADMIN_ROUTES.CATEGORIES} element={<AdminCategoryPage />} />
      <Route path={ADMIN_ROUTES.CUSTOMERS} element={<AdminUserManagement />} />
      <Route path={ADMIN_ROUTES.ORDERS}  element={<AdminOrderMangement/>}/>
      <Route path={ADMIN_ROUTES.COUPON} element={<CouponManagement/>} />
    </Route>
  </Routes>
);

export default AdminRoutes;
