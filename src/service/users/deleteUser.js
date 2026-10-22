// users/deleteUser.js
import axiosInstance from "../axiosInstance";

const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/delete/${id}`);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default deleteUser;