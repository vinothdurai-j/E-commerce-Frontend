// users/login.js
import axiosInstance from "../axiosInstance";

const login = async (payload) => {
  try {
    const response = await axiosInstance.post("/login", payload);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default login;