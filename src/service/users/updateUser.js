import axiosInstance from "../axiosInstance";

const updateUser = async ({ id, username, email, mobile }) => {
  try {
    const response = await axiosInstance.put(
      `/update/${id}`,
      {
        username: username.trim(),
        email: email.trim(),
        mobile,
      },
      { silent: true } // the Profile component shows its own toast
    );
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updateUser;