// addReview.js
import axiosInstance from "../axiosInstance";

const addReview = async (data) => {
  try {
    const response = await axiosInstance.post("/addReview", data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default addReview;