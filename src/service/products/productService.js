import api from "@/service/axiosInstance";

export const productService = {
  suggestions: (q) => api.get("/products/suggestions", { params: { q }, silent: true }),
  list: (params) => api.get("/products", { params }),
  detail: (id) => api.get(`/products/${id}`),
};