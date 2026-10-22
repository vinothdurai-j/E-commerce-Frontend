// products/deleteProduct.js
import axiosInstance from "../axiosInstance";

const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/deleteProduct/${id}`);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default deleteProduct;