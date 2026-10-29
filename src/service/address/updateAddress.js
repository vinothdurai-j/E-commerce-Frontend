import axiosInstance from "../axiosInstance";

const updateAddress = async ({ id, data }) => {
  try {
const response = await axiosInstance.put(`/updateAddress/${id}`, data);    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updateAddress;