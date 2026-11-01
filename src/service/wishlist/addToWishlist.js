// addToWishlist.js
import axiosInstance from "../axiosInstance";

const addToWishlist = async (data) => {
  try {
    const response = await axiosInstance.post("/addToWishlist", data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default addToWishlist;