// users/resetPassword.js
import axiosInstance from "../axiosInstance";

const resetPassword = async (payload) => {
  try {
    const response = await axiosInstance.post("/reset-password", payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default resetPassword;