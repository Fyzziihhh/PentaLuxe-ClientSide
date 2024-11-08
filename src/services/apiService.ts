
import axios from "axios";
import { AppHttpStatusCodes } from "../types/statusCode";
const baseURL="https://pentaluxe.shop"
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
    console.log(config)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    // Return the response as is for successful requests
    return response;
  },
  (error) => {
    // Check if the error response has a status of 403
    if (error.response.status===AppHttpStatusCodes.UNAUTHORIZED ) {
      // Redirect to the login page
      console.log(error.response.data)
      window.location.href = '/login'; // Adjust the path as needed
    }
    else if(error.response.status===AppHttpStatusCodes.FORBIDDEN){
      window.location.href='/admin'
    }
    
    // Reject the promise with the error to allow further handling if necessary
    return Promise.reject(error);
  }
);


export default api;
