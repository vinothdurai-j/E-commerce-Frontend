// removeItem.js
import axiosInstance from "../axiosInstance";

const removeItem = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/removeItem/${productId}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default removeItem;