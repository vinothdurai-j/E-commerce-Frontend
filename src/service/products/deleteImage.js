// products/deleteImage.js
import axiosInstance from "../axiosInstance";

const deleteImage = async ({ id, payload }) => {
  try {
    const response = await axiosInstance.delete(`/deleteImage/${id}`, { data: payload });
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default deleteImage;