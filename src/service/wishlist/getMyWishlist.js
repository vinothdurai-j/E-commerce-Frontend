// getMyWishlist.js
import axiosInstance from "../axiosInstance";

const getMyWishlist = async () => {
  try {
    const response = await axiosInstance.get("/getMyWishlist");
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getMyWishlist;