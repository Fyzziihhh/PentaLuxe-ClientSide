import  { useState } from "react";
import { adminLogin } from "../../utils/endpoints";
import InputBox from "../../components/InputBox";
import Button from "../../components/Button/Button";
import {  useNavigate } from "react-router-dom";
import api from "../../services/apiService";
  import { AxiosError } from "axios";
import { toast } from "sonner";
import { AppHttpStatusCodes } from "@/types/statusCode";
  // interface AxiosError extends Error {
  //   response?: {
  //     data: {
  //       message: string;
  //     };
  //   };
  // }
const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const AdminLoginHandler = async () => {
    try {
      const response = await api.post(adminLogin, { email, password });
      if (response.status===AppHttpStatusCodes.OK) {
        localStorage.setItem("adminToken", response.data.token);
        toast.success("admin LoggedIn SuccessFully");
        navigate("/admin/dashboard");
      }
    } catch (error) {
    if(error instanceof AxiosError) toast.error(error.response?.data.message || "Something Went Wrong");
      
    }
  };

  return (
    <>
      <div className="container w-full flex px-10 gap-3 h-[470px] mb-3  mt-9 ">
        <div
          style={{
            backgroundImage:
              "URL('/assets/Woman_in_Gold_RVB_72dpi_desktop.webp')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="left-container w-1/2 bg-blue-200 h-full "
        ></div>
        <div className="right-container w-1/2 bg-white flex flex-col items-center justify-start pt-5">
          <h1 className="font-Bowly text-4xl text-black ">Admin Login Page</h1>
         
          <div className="flex flex-col gap-10 mt-16 mb-6">
            <InputBox
              placeholder="Enter Your Email"
              Type="email"
              value={email}
              setValue={setEmail}
              textColor="black"
              borderColor="black"
            />
            <InputBox
              placeholder="Enter Your Password"
              Type="password"
              value={password}
              setValue={setPassword}
              borderColor="black"
              textColor="black"
            />
          </div>
          
          <Button text="Login" ButtonHandler={AdminLoginHandler} />
         
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
