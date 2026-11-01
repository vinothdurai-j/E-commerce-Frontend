// getCouponById.js
import axiosInstance from "../axiosInstance";

const getCouponById = async (id) => {
  try {
    const response = await axiosInstance.get(`/getCouponById/${id}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getCouponById;