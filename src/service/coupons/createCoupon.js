// createCoupon.js
import axiosInstance from "../axiosInstance";

const createCoupon = async (data) => {
  try {
    const response = await axiosInstance.post("/createCoupon", data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createCoupon;