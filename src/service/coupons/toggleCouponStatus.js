// toggleCouponStatus.js
import axiosInstance from "../axiosInstance";

const toggleCouponStatus = async (id) => {
  try {
    const response = await axiosInstance.patch(`/toggleCouponStatus/${id}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default toggleCouponStatus;