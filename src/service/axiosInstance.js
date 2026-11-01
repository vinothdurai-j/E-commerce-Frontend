import axios from "axios";
import { env } from "@/config/env";
import { tokenStorage } from "@/utils/tokenStorage";
import { notify } from "@/utils/toast";

const axiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
});
axiosInstance.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const silent = err.config?.silent;

    if (!err.response) {
      if (!silent) notify.error("Cannot reach the server. Please check your connection.");
      return Promise.reject(err);
    }

    const status = err.response.status;
    const message = err.response.data?.message || "Something went wrong";

    if (status === 401) {
      tokenStorage.clear();
      const { pathname, search } = window.location;
      if (!pathname.startsWith("/login")) {
        window.location.href = `/login?next=${encodeURIComponent(pathname + search)}`;
      }
    } else if (!silent) {
      notify.error(message);
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;