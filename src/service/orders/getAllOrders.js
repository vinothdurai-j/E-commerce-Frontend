// getAllOrders.js  (admin)
import axiosInstance from "../axiosInstance";

const getAllOrders = async (params) => {
  try {
    const response = await axiosInstance.get("/getAllOrders", { params });
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getAllOrders;