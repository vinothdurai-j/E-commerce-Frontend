import axiosInstance from "../axiosInstance";

const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/getCategoryById/${id}`);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getCategoryById;