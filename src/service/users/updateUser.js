// users/updateUser.js
import axiosInstance from "../axiosInstance";

const updateUser = async ({ id, payload }) => {
  try {
    const response = await axiosInstance.put(`/update/${id}`, payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default updateUser;