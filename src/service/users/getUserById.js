import axiosInstance from "../axiosInstance";

const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/getuserById/${id}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getUserById;