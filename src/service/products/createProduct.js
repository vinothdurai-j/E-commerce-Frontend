// products/createProduct.js
import axiosInstance from "../axiosInstance";

const createProduct = async (payload) => {
  try {
    const response = await axiosInstance.post("/createProduct", payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default createProduct;