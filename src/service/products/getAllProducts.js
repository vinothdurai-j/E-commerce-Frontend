// // products/getAllProducts.js
// import axiosInstance from "../axiosInstance";

// const getAllProducts = async (params) => {
//   try {
//     const response = await axiosInstance.get("/getAllProducts", { params });
//     return response?.data;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

// export default getAllProducts;


import api from "@/service/axiosInstance.js"; // <- un existing axios import-ah inga vainga

export default async function getAllProducts(params) {
  const res = await api.get("/products", { params });

  // Backend shape enna-nu theriya console-la paarunga (aprm remove pannidalaam)
  console.log("products response:", res.data);

  // undefined ever return aagaadhu, so "Query data cannot be undefined" error poidum
  return res.data ?? [];
}