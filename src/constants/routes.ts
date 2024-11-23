export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  LOGIN: "/login",
  REGISTER: "/register",
  OTP_VERIFY: "/otp-verify",
  PROFILE: "/profile",
  CART: "/cart",
  WISHLIST: "/wishlist",
  CHECK_OUT: "/checkout",
  ORDERS:"orders",
  WALLET:"wallet",
  FORGOT_PASSSWORD:'forgot-password'
  
} as const;

export const ADMIN_ROUTES = {
  LOGIN: "/",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  CUSTOMERS: "/customers",
  ORDERS:'/orders',
  COUPON:'/coupons',
  OFFER:'/offer',
    SALES_REPORT:'sales-report'
} as const;

export default ADMIN_ROUTES;
