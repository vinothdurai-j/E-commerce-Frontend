// updateCoupon.js
import axiosInstance from "../axiosInstance";

const updateCoupon = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/updateCoupon/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updateCoupon;