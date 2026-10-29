import axiosInstance from "../axiosInstance";

const getAddressById = async (id) => {
  try {
const response = await axiosInstance.get(`/getAddressById/${id}`);    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getAddressById;