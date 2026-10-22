// products/getProductById.js
import axiosInstance from "../axiosInstance";

const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/getProductById/${id}`);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getProductById;