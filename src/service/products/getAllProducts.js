// products/getAllProducts.js
import axiosInstance from "../axiosInstance";

const getAllProducts = async (params) => {
  try {
    const response = await axiosInstance.get("/getAllProducts", { params });
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getAllProducts;