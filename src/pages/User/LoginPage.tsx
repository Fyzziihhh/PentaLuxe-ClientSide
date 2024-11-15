import { ChangeEvent, useState } from "react";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/apiService";
import GoogleAuth from "../../components/GoogleAuthentication/GoogleAuth";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Input from "@/components/Input/Input";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { useDispatch } from "react-redux";
import { LogIn } from "@/store/slices/userSlice";




const LoginPage = () => {
  const dispatch=useDispatch()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const LoginHandler = async () => {
    if(email.trim()===''||password.trim()===''){
      toast.error('Email & Password are required')
      return
    }
    try {
      const response = await api.post("/api/user/login", { email, password });
      const data = response.data.data;
      console.log("data",data)
      if (response.status===AppHttpStatusCodes.OK) {
          dispatch(LogIn())
        localStorage.setItem("accessToken", data.accessToken);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    }
  };

  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  return (
    <>
      <div className="container w-full flex px-10 gap-3 h-[470px] mb-3 ">
        <div
          style={{
            backgroundImage:
              "URL('/assets/Woman_in_Gold_RVB_72dpi_desktop.webp')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="left-container w-1/2 bg-blue-200 h-full "
        ></div>
        <div className="right-container w-1/2 bg-secondary flex flex-col items-center justify-start pt-5">
          <h1 className="font-Bowly text-4xl ">Login Page</h1>
          <div className="Logos flex items-center gap-3 mt-5">
            {/* <img
              className="w-12 h-12 object-cover"
              src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
              alt=""
            /> */}
            <GoogleAuth text="SignIn with Google" />
            {/* <img
              className="w-10 h-10 object-cover"
              src="https://1000logos.net/wp-content/uploads/2017/02/Facebook-Logosu.png"
              alt=""
            /> */}
          </div>
          <div className="flex flex-col  gap-5 mt-10">
            <Input
              text="Enter Your Email"
              type="text"
              value={email}
              inputHandler={emailHandler}
            />

            <Input
              text="Enter Your Password"
              type="password"
              value={password}
              inputHandler={passwordHandler}
            />
          </div>
          <Link className="text-blue-700 ml-80 hover:text-blue-900 " to="#">
            Forgot your password?
          </Link>
          <Button text="Login" ButtonHandler={LoginHandler} />
          <Link
            to="/register"
            className="text-blue-700 mt-5  hover:text-blue-900 "
          >
            Don't have an account? Sign up here.
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
