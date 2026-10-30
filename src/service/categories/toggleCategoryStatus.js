import axiosInstance from "../axiosInstance";

const toggleCategoryStatus = async (id) => {
  try {
    const response = await axiosInstance.patch(`/toggleCategoryStatus/${id}`);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default toggleCategoryStatus;