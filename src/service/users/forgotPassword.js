// service/users/forgotPassword.js
import axiosInstance from "../axiosInstance";

const forgotPassword = async ({ email }) => {
  try {
    const response = await axiosInstance.post(
      "/forgot-password",
      { email: email.trim() },
      { silent: true }
    );
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default forgotPassword;