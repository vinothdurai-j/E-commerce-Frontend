// getOrderById.js
import axiosInstance from "../axiosInstance";

const getOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(`/getOrderById/${id}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getOrderById;