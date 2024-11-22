import axios from "axios";
import { AppHttpStatusCodes } from "../types/statusCode";
import { toast } from "sonner";
import store from "@/store/store";
import { logOut } from "@/store/slices/userSlice";
// const baseURL = "https://pentaluxe.shop";
const baseURL = "http://localhost:7000";
const dispatch=store.dispatch
const api = axios.create({
  baseURL,

  headers: {
    "Content-Type": "application/json",
  },
});
             
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const adminToken=localStorage.getItem('adminToken')
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    if(adminToken){
      config.headers['x-admin-authorization']=`Bearer ${adminToken}`
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
        toast.error(data.message)
        dispatch(logOut())
        setTimeout(() => {
          if (window.location.pathname !== "/login") {
             
              window.location.href = "/login";
          }
      }, 1000);
      
      } else if (status === AppHttpStatusCodes.FORBIDDEN) {
        console.log("Forbidden Access:", data);
        toast.error(data.message)
        setTimeout(()=>{
          window.location.href = "/admin";
        },1500)
      
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
