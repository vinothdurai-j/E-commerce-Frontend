// service/users/register.js
import axiosInstance from "../axiosInstance";

const register = async ({ name, email, mobile, password }) => {
  try {
    const response = await axiosInstance.post(
      "/register",
      {
        username: name,
        email,
        mobile,
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

export default register;