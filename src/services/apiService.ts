import axios from "axios";
import { AppHttpStatusCodes } from "../types/statusCode";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// const refreshAccessToken = async () => {
//   try {
//     const refreshToken = localStorage.getItem("refreshToken");
//     const response = await api.post("/api/user/refresh-token", {
//       token: refreshToken,
//     });
//     const newAccessToken = response.data.accessToken;
//     localStorage.setItem("accessToken", newAccessToken);
//     return newAccessToken;
//   } catch (error) {
//     console.log("refreshToken Error", error);
//     return null;
//   }
// };

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
      
    }
    console.log(config)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === AppHttpStatusCodes.UNAUTHORIZED && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const newToken = await refreshAccessToken();
//       if (newToken) {
//         originalRequest.headers.authorization = `Bearer ${newToken}`;
//         return api(originalRequest);
//       }
//     }
//     return Promise.reject(error)
//   }
// );

export default api;
