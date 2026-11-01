// addToCart.js
import axiosInstance from "../axiosInstance";

const addToCart = async (data) => {
  try {
    const response = await axiosInstance.post("/addToCart", data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default addToCart;