// deleteCoupon.js
import axiosInstance from "../axiosInstance";

const deleteCoupon = async (id) => {
  try {
    const response = await axiosInstance.delete(`/deleteCoupon/${id}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default deleteCoupon;