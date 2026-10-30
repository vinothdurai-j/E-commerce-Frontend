import axiosInstance from "@/service/axiosInstance";

export const filterProducts = async (params = {}) => {
  try {
    const body = await axiosInstance.get("/filterProducts", { params, silent: true });
    return { data: body?.data ?? [], count: body?.count ?? 0 };
  } catch (err) {
    if (err.response?.status === 404) return { data: [], count: 0 };
    throw err;
  }
};

export default filterProducts; // rendu import style-um work aagum