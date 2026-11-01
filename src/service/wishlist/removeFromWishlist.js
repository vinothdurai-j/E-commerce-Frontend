// removeFromWishlist.js
import axiosInstance from "../axiosInstance";

const removeFromWishlist = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/removeFromWishlist/${productId}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default removeFromWishlist;