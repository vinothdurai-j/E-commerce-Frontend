// src/service/categories/getCategoryTree.js
import axiosInstance from "../axiosInstance";

export default async function getCategoryTree() {
  try {
    const body = await axiosInstance.get("/getCategoryTree");
    return body?.data ?? [];
  } catch (err) {
    const error = new Error(err.response?.data?.message || err.message || "Failed to load categories");
    error.status = err.response?.status;
    throw error;
  }
}