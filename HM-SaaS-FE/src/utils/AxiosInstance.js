import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// for form data for file input 
export const axiosInstance2 = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance2.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getErrorMessage = (error) =>
  error.response?.data?.message || error.response?.data?.error || "";

const clearAuthAndRedirect = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("username");

  if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
    window.location.href = "/login";
  }
};

const tenantInterceptor = (error) => {
  const message = getErrorMessage(error);

  if (
    error.response?.status === 401 &&
    (message.includes("Not Authorized") ||
      message.includes("Invalid Token") ||
      message.includes("No Token") ||
      message.includes("User Not Found"))
  ) {
    clearAuthAndRedirect();
  }

  if (
    error.response &&
    (error.response.status === 403 || error.response.status === 404) &&
    (message.includes("No organization associated") ||
     message.includes("No tenant associated") ||
     message.includes("Tenant not found"))
  ) {
    if (window.location.pathname !== "/onboard" && window.location.pathname !== "/subscription") {
      window.location.href = "/onboard";
    }
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use((response) => response, tenantInterceptor);
axiosInstance2.interceptors.response.use((response) => response, tenantInterceptor);

export default axiosInstance;
