// updateReview.js
import axiosInstance from "../axiosInstance";

const updateReview = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/updateReview/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updateReview;