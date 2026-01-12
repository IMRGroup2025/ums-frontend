import axios from "axios";
import { getUser } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
 
  if (!config.url.includes("/auth/login")) {
    const user = getUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
