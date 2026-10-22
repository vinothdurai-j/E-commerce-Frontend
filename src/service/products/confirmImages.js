// products/confirmImages.js
import axiosInstance from "../axiosInstance";

const confirmImages = async ({ id, payload }) => {
  try {
    const response = await axiosInstance.post(`/confirmImages/${id}`, payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default confirmImages;