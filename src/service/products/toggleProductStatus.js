// products/toggleProductStatus.js
import axiosInstance from "../axiosInstance";

const toggleProductStatus = async (id) => {
  try {
    const response = await axiosInstance.patch(`/toggleProductStatus/${id}`);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default toggleProductStatus;