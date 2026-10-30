import axiosInstance from "../axiosInstance";

const updateCategory = async ({ id, payload }) => {
  try {
    const response = await axiosInstance.put(`/updateCategory/${id}`, payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default updateCategory;