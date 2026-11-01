// cancelOrder.js
import axiosInstance from "../axiosInstance";

const cancelOrder = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/cancelOrder/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default cancelOrder;