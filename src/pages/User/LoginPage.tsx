import React, { useState } from "react";

import InputBox from "../../components/InputBox/InputBox";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/apiService";
import SignIn from "../../components/GoogleAuthentication/SignIn";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const navigate= useNavigate()
  const LoginHandler = async() => {
    
try {
   const response = await api.post('/api/user/login',{email,password})
   const data =response.data
      if(data.success){
         localStorage.setItem('accessToken',data.accessToken)
         localStorage.setItem('refreshToken',data.refreshToken)
        navigate('/')
      }
} catch (error:any) {
  alert(error?.response.data.message)
}
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
            <SignIn/>
            <img
              className="w-10 h-10 object-cover"
              src="https://1000logos.net/wp-content/uploads/2017/02/Facebook-Logosu.png"
              alt=""
            />
          </div>
      <div className="flex flex-col gap-10 mt-10">

          <InputBox
            placeholder="Enter Your Email"
            Type="email"
            value={email}
            setValue={setEmail}
            textColor="white"
            borderColor="zinc"
            
          />
          <InputBox
            placeholder="Enter Your Password"
            Type="password"
            value={password}
            setValue={setPassword}
              textColor="white"
            borderColor="zinc"
          />
      </div>
          <Link className="text-blue-700 ml-80 hover:text-blue-900 " to='#'>
          Forgot your password?
          </Link>
          <Button text="Login" ButtonHandler={LoginHandler} />
          <Link to='/register' className="text-blue-700 mt-5  hover:text-blue-900 ">
          Don't have an account? Sign up here.</Link>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
