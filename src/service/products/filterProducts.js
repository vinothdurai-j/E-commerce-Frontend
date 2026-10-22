// products/filterProducts.js
import axiosInstance from "../axiosInstance";

const filterProducts = async (filters) => {
  try {
    const response = await axiosInstance.get("/filterProducts", { params: filters });
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default filterProducts;