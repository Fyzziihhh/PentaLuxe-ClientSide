import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { Toaster } from "sonner";
import CategoryPage from "./pages/User/CategoryPage";
const ProductDetailPage = lazy(() => import("./pages/User/ProductDetailPage"));
const AdminUserManagement = lazy(
  () => import("./pages/Admin/AdminUserManagement")
);
const HomePage = lazy(() => import("./pages/User/HomePage"));
const AboutPage = lazy(() => import("./pages/User/AboutPage"));
const AllProductsPage = lazy(() => import("./pages/User/AllProductsPage"));
const LoginPage = lazy(() => import("./pages/User/LoginPage"));
const MinimalLayout = lazy(() => import("./layout/MinimalLayout"));
const OtpVerifyPage = lazy(() => import("./pages/User/OtpVerifyPage"));
const AdminLoginPage = React.lazy(() => import("./pages/Admin/AdminLoginPage"));
const AdminDashboard = React.lazy(
  () => import("./pages/Admin/AdminDashboardPage")
);
const AdminProductsPage = React.lazy(
  () => import("./pages/Admin/AdminProductsPage")
);
const AdminCategoryPage = React.lazy(
  () => import("./pages/Admin/AdminCategoryPage")
);
// const AdminSideBar = React.lazy(() => import('./components/AdminSideBar/AdminSideBar'));
const AdminLayout = React.lazy(() => import("./layout/AdminLayout"));
const AdminAddAndEditProduct = React.lazy(
  () => import("./pages/Admin/AdminAddAndEditProduct")
);
const SignupPage = lazy(() => import("./pages/User/SignupPage"));
const App = () => {
  return (
    <>
      <Router>
        <Toaster closeButton position="top-center" richColors expand />
        <Suspense fallback="Loading......">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="products">
                <Route index element={<AllProductsPage />} />
                <Route path=":id" element={<ProductDetailPage />} />
              </Route>
              <Route path="/categories/:id" element={<CategoryPage/>}/>
            </Route>

            <Route element={<MinimalLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<SignupPage />} />
              <Route path="otp-verify/:id" element={<OtpVerifyPage />} />
            </Route>

            {/* admin */}
            <Route path="admin">
              <Route index element={<AdminLoginPage />} />
              {/* AdminLayout */}
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products">
                  <Route index element={<AdminProductsPage />} />
                  <Route path="add" element={<AdminAddAndEditProduct />} />
                  <Route path=':id' element={<AdminAddAndEditProduct/>} />
                </Route>
                <Route path="categories" element={<AdminCategoryPage />} />
                <Route path="banner" />
                <Route path="customers" element={<AdminUserManagement />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
};

export default App;
