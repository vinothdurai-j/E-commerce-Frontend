// service/users/resetPassword.js
import axiosInstance from "../axiosInstance";

// Backend: POST /v1/reset-password, validated by resetPasswordValidation
// -> { email, otp, password, confirmPassword }
const resetPassword = async ({ email, otp, password }) => {
  try {
    const response = await axiosInstance.post(
      "/reset-password",
      {
        email: email.trim(),
        otp,
        password,
        confirmPassword: password,
      },
      { silent: true }
    );
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default resetPassword;