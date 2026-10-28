import axiosInstance from "../axiosInstance";

const login = async ({ identifier, password }) => {
  try {
    const response = await axiosInstance.post(
      "/login",
      {
        identifier: identifier.trim(),
        password,
      },
      { silent: true }
    );
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default login;