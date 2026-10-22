// users/forgotPassword.js
import axiosInstance from "../axiosInstance";

const forgotPassword = async (payload) => {
  try {
    const response = await axiosInstance.post("/forgot-password", payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default forgotPassword;