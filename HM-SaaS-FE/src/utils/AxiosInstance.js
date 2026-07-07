import axios from "axios";

const axiosInstance = axios.create({
//  baseURL: "http://localhost:5000",
   baseURL: "http://localhost:3000",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

// for form data for file input 
export const axiosInstance2 = axios.create({
  // baseURL: "http://localhost:5000",
    baseURL: "http://localhost:3000",

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

const tenantInterceptor = (error) => {
  if (
    error.response &&
    error.response.status === 403 &&
    error.response.data?.message?.includes("No organization associated")
  ) {
    if (window.location.pathname !== "/onboard") {
      window.location.href = "/onboard";
    }
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use((response) => response, tenantInterceptor);
axiosInstance2.interceptors.response.use((response) => response, tenantInterceptor);

export default axiosInstance;
