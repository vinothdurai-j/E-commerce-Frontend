// placeOrder.js
import axiosInstance from "../axiosInstance";

const placeOrder = async (data) => {
  try {
    const response = await axiosInstance.post("/placeOrder", data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default placeOrder;