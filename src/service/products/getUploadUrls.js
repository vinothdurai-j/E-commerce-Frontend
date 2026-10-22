// products/getUploadUrls.js
import axiosInstance from "../axiosInstance";

const getUploadUrls = async ({ id, payload }) => {
  try {
    const response = await axiosInstance.post(`/getUploadUrls/${id}`, payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getUploadUrls;