import axiosInstance from "../axiosInstance";

const createCategory = async (payload) => {
  try {
    const response = await axiosInstance.post("/createCategory", payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default createCategory;