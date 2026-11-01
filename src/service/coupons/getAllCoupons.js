// getAllCoupons.js
import axiosInstance from "../axiosInstance";

const getAllCoupons = async (params) => {
  try {
    const response = await axiosInstance.get("/getAllCoupons", { params });
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getAllCoupons;