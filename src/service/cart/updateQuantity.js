// updateQuantity.js
import axiosInstance from "../axiosInstance";

const updateQuantity = async (data) => {
  try {
    const response = await axiosInstance.put("/updateQuantity", data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updateQuantity;