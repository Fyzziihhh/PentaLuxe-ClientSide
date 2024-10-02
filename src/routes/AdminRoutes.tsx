import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
// import ProtectedRoute from "../components/ProtectedRoute";
import ADMIN_ROUTES from "../constants/routes";


const AdminLoginPage = lazy(() => import("../pages/Admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboardPage"));
const AdminProductsPage = lazy(
  () => import("../pages/Admin/AdminProductsPage")
);
const AdminAddAndEditProduct = lazy(
  () => import("../pages/Admin/AdminAddAndEditProduct")
);
const AdminCategoryPage = lazy(
  () => import("../pages/Admin/AdminCategoryPage")
);
const AdminUserManagement = lazy(
  () => import("../pages/Admin/AdminUserManagement")
);

const AdminRoutes: React.FC = () => (
  <Routes>
    <Route index element={<AdminLoginPage />} />
    <Route element={<AdminLayout />}>
      <Route path={ADMIN_ROUTES.DASHBOARD} element={<AdminDashboard />} />
      <Route path={ADMIN_ROUTES.PRODUCTS}>
        <Route index element={<AdminProductsPage />} />
        <Route path="add" element={<AdminAddAndEditProduct />} />
        <Route path=":id" element={<AdminAddAndEditProduct />} />
      </Route>
      <Route path={ADMIN_ROUTES.CATEGORIES} element={<AdminCategoryPage />} />
      <Route path={ADMIN_ROUTES.CUSTOMERS} element={<AdminUserManagement />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
