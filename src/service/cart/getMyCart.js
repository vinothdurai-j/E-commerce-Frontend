// getMyCart.js
import axiosInstance from "../axiosInstance";

const getMyCart = async () => {
  try {
    const response = await axiosInstance.get("/getMyCart");
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getMyCart;