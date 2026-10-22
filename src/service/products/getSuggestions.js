// products/getSuggestions.js
import axiosInstance from "../axiosInstance";

const getSuggestions = async (q) => {
  try {
    const response = await axiosInstance.get("/filterProducts", {
      params: { search: q, limit: 6 }, // param names backend-ku match pannanum
      silent: true,
    });
    return response?.data ?? [];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default getSuggestions;