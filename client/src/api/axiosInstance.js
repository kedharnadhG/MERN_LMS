import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_BACKEND_BASEURL}`,
});

//evertime if you refresh the page, it will send the token and checks whether user is authenticated or not
axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(sessionStorage.getItem("accessToken")) || "";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
