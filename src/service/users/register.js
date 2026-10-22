// users/register.js
import axiosInstance from "../axiosInstance";

const register = async (payload) => {
  try {
    const response = await axiosInstance.post("/register", payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default register;