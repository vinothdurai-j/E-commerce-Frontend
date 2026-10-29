import axiosInstance from "../axiosInstance";

const getMyAddresses = async () => {
  try {
const response = await axiosInstance.get("/getMyAddresses");    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getMyAddresses;