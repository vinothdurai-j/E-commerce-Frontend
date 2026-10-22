// users/getUserById.js
import axiosInstance from "../axiosInstance";

const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/getuserById/${id}`);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getUserById;