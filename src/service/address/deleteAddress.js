import axiosInstance from "../axiosInstance";

const deleteAddress = async (id) => {
  try {
    const response = await axiosInstance.delete(`/deleteAddress/${id}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default deleteAddress;