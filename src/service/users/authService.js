// src/service/users/authService.js
import api from "@/service/axiosInstance";

export const authService = {
  login: (payload) => api.post("/login", payload),
  register: (payload) => api.post("/register", payload),
  forgotPassword: (payload) => api.post("/forgot-password", payload),
  resetPassword: (payload) => api.post("/reset-password", payload),
};

export const userService = {
  getById: (id) => api.get(`/getuserById/${id}`),
  update: (id, payload) => api.put(`/update/${id}`, payload),
  remove: (id) => api.delete(`/delete/${id}`),
};