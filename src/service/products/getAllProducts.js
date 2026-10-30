import api from "@/service/axiosInstance";

export default async function getAllProducts() {
  const body = await api.get("/getAllProducts"); // interceptor already body return pannum
  const data = body?.data ?? [];
  return { data, count: data.length };
}