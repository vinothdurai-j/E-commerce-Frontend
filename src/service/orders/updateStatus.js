// updateStatus.js  (admin)
import axiosInstance from "../axiosInstance";

const updateStatus = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/updateStatus/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updateStatus;