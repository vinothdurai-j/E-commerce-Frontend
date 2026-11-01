// getMyOrders.js
import axiosInstance from "../axiosInstance";

const getMyOrders = async (params) => {
  try {
    const response = await axiosInstance.get("/getMyOrders", { params });
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getMyOrders;