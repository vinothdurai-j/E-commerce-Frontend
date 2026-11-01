// getProductReviews.js
import axiosInstance from "../axiosInstance";

const getProductReviews = async (productId, params) => {
  try {
    const response = await axiosInstance.get(`/getProductReviews/${productId}`, { params });
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getProductReviews;