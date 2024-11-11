import axios from "axios";
import { AppHttpStatusCodes } from "../types/statusCode";
const baseURL = "https://pentaluxe.shop";
// const baseURL = "http://localhost:7000";
const api = axios.create({
  baseURL,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    console.log(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === AppHttpStatusCodes.UNAUTHORIZED) {
        console.log("Unauthorized Access:", data);
        // window.location.href = "/login";
      } else if (status === AppHttpStatusCodes.FORBIDDEN) {
        console.log("Forbidden Access:", data);
        window.location.href = "/admin";
      } else {
        console.error("Error Response:", data);
      }
    } else {
      // Handle network or other errors
      console.error("Request Error:", error);
    }
    return Promise.reject(error);
  }
);

export default api;
