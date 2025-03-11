import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
const apiKey = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiKey,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;