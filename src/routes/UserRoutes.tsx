import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import MinimalLayout from "../layout/MinimalLayout";
import { ROUTES } from "../constants/routes";
import CartPage from "../pages/User/CartPage";
import WishListPage from "../pages/User/WishListPage";

// import Address from "../pages/User/Address";

const HomePage = lazy(() => import("../pages/User/HomePage"));
const AboutPage = lazy(() => import("../pages/User/AboutPage"));
const AllProductsPage = lazy(() => import("../pages/User/AllProductsPage"));
const ProductDetailPage = lazy(() => import("../pages/User/ProductDetailPage"));
const CategoryPage = lazy(() => import("../pages/User/CategoryPage"));
const LoginPage = lazy(() => import("../pages/User/LoginPage"));
const SignupPage = lazy(() => import("../pages/User/SignupPage"));
const OtpVerifyPage = lazy(() => import("../pages/User/OtpVerifyPage"));
const UserProfileLayout = lazy(() => import("../layout/UserProfileLayout"));
const Profile = lazy(() => import("../pages/User/Profile"));
const Address = lazy(() => import("../pages/User/Address"));
const AddAndEditAddress = lazy(() => import("../pages/User/AddAndEditAddress"));

const UserRoutes: React.FC = () => (
  <Routes>
    <Route element={<MainLayout/>}>
      <Route index element={<HomePage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.PRODUCTS}>
        <Route index element={<AllProductsPage />} />
        <Route path=":id" element={<ProductDetailPage />} />
      </Route>
      <Route path={`${ROUTES.CATEGORIES}/:id`} element={<CategoryPage />} />
      <Route  path={ROUTES.PROFILE} element={<UserProfileLayout />}>
        <Route index element={<Profile />} />
        <Route path="address-book">
          <Route index element={<Address/>}/>
          <Route  path=":id" element={<AddAndEditAddress />} />
          <Route  path="add" element={<AddAndEditAddress />} />
        </Route>
      </Route>
      <Route path={ROUTES.CART} element={<CartPage/>}/>
      <Route path={ROUTES.WISHLIST} element={<WishListPage/>}/>
    </Route>

    <Route element={<MinimalLayout />}>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<SignupPage />} />
      <Route path={`${ROUTES.OTP_VERIFY}/:id`} element={<OtpVerifyPage />} />
    </Route>
  </Routes>
);

export default UserRoutes;
