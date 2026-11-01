// validateCoupon.js
import axiosInstance from "../axiosInstance";

const validateCoupon = async (data) => {
  try {
    const response = await axiosInstance.post("/validateCoupon", data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default validateCoupon;