import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the admin JWT (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sritech_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Central 401 handling - bounce back to admin login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith("/admin")) {
      localStorage.removeItem("sritech_token");
      localStorage.removeItem("sritech_admin");
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
