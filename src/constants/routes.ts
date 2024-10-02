


export const ROUTES = {
    HOME: "/",
    ABOUT: "/about",
    PRODUCTS: "/products",
    CATEGORIES: "/categories",
    LOGIN: "/login",
    REGISTER: "/register",
    OTP_VERIFY: "/otp-verify",
    PROFILE:'/profile',
        CART:'/cart',
        WISHLIST:'/wishlist'
  } as const;


  export const ADMIN_ROUTES = {
    LOGIN: "/",
    DASHBOARD: "/dashboard",
    PRODUCTS: "/products",
    CATEGORIES: "/categories",
    CUSTOMERS: "/customers",


  } as const;
  
  export default ADMIN_ROUTES; 
  