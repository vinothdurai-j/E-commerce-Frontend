// deleteReview.js
import axiosInstance from "../axiosInstance";

const deleteReview = async (id) => {
  try {
    const response = await axiosInstance.delete(`/deleteReview/${id}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default deleteReview;