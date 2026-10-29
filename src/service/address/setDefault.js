import axiosInstance from "../axiosInstance";

const setDefault = async (id) => {
  try {
const response = await axiosInstance.patch(`/setDefault/${id}`);    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default setDefault;