import axiosInstance from "@/service/axiosInstance.js";

export default async function getCategoryTree() {
  try {
    const res = await axiosInstance.get("/getCategoryTree"); // actual route
    return res?.data ?? [];   // res.data illa res.data.data
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Failed to load categories";
    const error = new Error(message);
    error.status = err.response?.status;
    throw error;
  }
}