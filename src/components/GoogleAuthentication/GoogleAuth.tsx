import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "./Config";
import { signInWithPopup } from "firebase/auth";
import api from "../../services/apiService";
import {  toast } from "sonner";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { useDispatch } from "react-redux";
import { LogIn } from "@/store/slices/userSlice";

type GoogleAuthProps = {
  text: string;
};
const GoogleAuth: React.FC<GoogleAuthProps> = ({ text }) => {
  const navigate = useNavigate();
 const dispatch=useDispatch()
  const handleSignIn = () => {
    signInWithPopup(auth, provider).then(async (data) => {
      if (data.user) {
        try {
        
          const response = await api.post("/api/user/google-auth", {
            username: data.user.displayName,
            email: data.user.email,
          });
          if (response.status===AppHttpStatusCodes.OK) {
           
            const data=response.data.data
            console.log("inside the GoogleAuth")
            dispatch(LogIn())
            localStorage.setItem("accessToken",data.accessToken);
         
       
            const promise = () =>
              new Promise((resolve) =>
                setTimeout(() => resolve({ name: "Sonner" }), 2000)
              );
            toast.promise(promise, {
              loading: "Loading...",
              success: () => {
                setTimeout(() => {
                  navigate("/");
                }, 1000);
                return response.data.message;
              },
              error: "Error occurred",
            });
          }
        } catch (error: any) {
          toast.error(error?.response?.data.message);
        }
      }
    });
  };

  return (
    <div>
    
      <button
        className="flex items-center font-gilroy font-extrabold bg-white text-black rounded-xl px-6 gap-3"
        onClick={handleSignIn}
      >
        <img
          className="w-12 h-12 object-cover"
          src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
          alt="Google Logo"
        />
        {text}
      </button>
    </div>
  );
};

export default GoogleAuth;
