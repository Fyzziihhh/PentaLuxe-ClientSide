import { useNavigate } from "react-router-dom";
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

// const navigate=useNavigate()
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Check for FORBIDDEN error
//     if (error.response && error.response.status === AppHttpStatusCodes.FORBIDDEN && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // Redirect to login
//       navigate('/login');

//       // Uncomment this block if you implement token refreshing
//       // const newToken = await refreshAccessToken();
//       // if (newToken) {
//       //   originalRequest.headers.authorization = `Bearer ${newToken}`;
//       //   return api(originalRequest);
//       // }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
