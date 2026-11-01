// adminDeleteReview.js
import axiosInstance from "../axiosInstance";

const adminDeleteReview = async (id) => {
  try {
    const response = await axiosInstance.delete(`/adminDeleteReview/${id}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default adminDeleteReview;