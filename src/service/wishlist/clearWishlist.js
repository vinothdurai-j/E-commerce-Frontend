// clearWishlist.js
import axiosInstance from "../axiosInstance";

const clearWishlist = async () => {
  try {
    const response = await axiosInstance.delete("/clearWishlist");
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default clearWishlist;