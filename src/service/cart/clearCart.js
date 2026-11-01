// clearCart.js
import axiosInstance from "../axiosInstance";

const clearCart = async () => {
  try {
    const response = await axiosInstance.delete("/clearCart");
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default clearCart;