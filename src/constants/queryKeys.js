export const queryKeys = {
  products: {
    all: ["products"],
    list: (filters) => ["products", "list", filters],
    detail: (id) => ["products", "detail", id],
    suggestions: (term) => ["products", "suggestions", term],
  },
  categories: ["categories"],
  cart: ["cart"],
  wishlist: ["wishlist"],
  orders: { all: ["orders"], detail: (id) => ["orders", id] },
  reviews: (productId) => ["reviews", productId],
  coupons: ["coupons"],
  address: ["address"],
  user: ["user"],
};