// products/updateProduct.js
import axiosInstance from "../axiosInstance";

const updateProduct = async ({ id, payload }) => {
  try {
    const response = await axiosInstance.put(`/updateProduct/${id}`, payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default updateProduct;