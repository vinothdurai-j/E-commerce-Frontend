
import axiosInstance from "../axiosInstance";

const addAddress = async (data) => {
  try {
const response = await axiosInstance.post("/addAddress", data);    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default addAddress;