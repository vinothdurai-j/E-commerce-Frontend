import axiosInstance from "@/service/axiosInstance.js";

// Backend-la tree API illa: /getAllCategories flat list vaangi, inga tree build panrom
export default async function getCategoryTree() {
  try {
    const res = await axiosInstance.get("/getAllCategories");
    const list = res?.data ?? [];
    const parentId = (c) => c.parent?._id ?? c.parent ?? null;

    return list
      .filter((c) => !parentId(c))
      .map((c) => ({
        ...c,
        items: list
          .filter((x) => parentId(x) === c._id)
          .map((x) => ({ id: x._id, name: x.name, slug: x.slug })),
      }));
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Failed to load categories";
    const error = new Error(message);
    error.status = err.response?.status;
    throw error;
  }
}