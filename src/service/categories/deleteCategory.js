import axiosInstance from "../axiosInstance";

const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/deleteCategory/${id}`);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default deleteCategory;