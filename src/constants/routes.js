export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAILS: "/products/:id",
  CATEGORY: "/category/:slug",
  SUBCATEGORY: "/category/:slug/:sub",
  OFFERS: "/offers",
  SEARCH: "/search",

  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_SUCCESS: "/order-success",
  ORDERS: "/orders",
  WISHLIST: "/wishlist",
  PROFILE: "/profile",

  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  ABOUT: "/about",
  CONTACT: "/contact",
  HELP: "/help",
  FAQS: "/faqs",
  SHIPPING_POLICY: "/shipping-policy",
  RETURN_POLICY: "/return-policy",
  PRIVACY: "/privacy-policy",
  TERMS: "/terms",

  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_COUPONS: "/admin/coupons",
};

export const productPath = (id) => `/products/${id}`;