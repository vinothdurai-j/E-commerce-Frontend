import axiosInstance from "../axiosInstance";

const getSuggestions = async (q) => {
  try {
    const body = await axiosInstance.get("/filterProducts", {
      params: { search: q },
      silent: true,
    });
    return (body?.data ?? []).slice(0, 6); // limit frontend-la
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
};

export default getSuggestions;