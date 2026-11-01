// getMyReviews.js
import axiosInstance from "../axiosInstance";

const getMyReviews = async (params) => {
  try {
    const response = await axiosInstance.get("/getMyReviews", { params });
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getMyReviews;