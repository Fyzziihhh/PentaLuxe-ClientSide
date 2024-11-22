import React, { useEffect, useState } from "react";
import Button from "../../components/Button/Button";

import { Link } from "react-router-dom";
import api from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../../components/GoogleAuthentication/GoogleAuth";
import { toast } from "sonner";
import Input from "@/components/Input/Input";

import { AppHttpStatusCodes } from "@/types/statusCode";
import { PulseLoader } from "react-spinners";
import { useSelector } from "react-redux";



interface InputField {
  text: string;
  type: string;
  value: string;
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignupPage = () => {
  const [isLoading,setIsLoading]=useState(false)
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate=useNavigate()

  const [phone, setPhone] = useState("");

  const Navigate = useNavigate();

  const registerHandler = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    const showError = (message: string) => {
      toast.error(message);
    };
  
   
    if (!username.trim()) {
      showError("Username is required");
      return;
    }
  
    if (!email.trim()) {
      showError("Email is required");
      return;
    }
  
    if (!password.trim() || !confirmPassword.trim()) {
      showError("Passwords are required");
      return;
    }
  
    if (password !== confirmPassword) {
      showError("Passwords don't match");
      return;
    }
  
    if (!phone) {
      showError("Phone number is required");
      return;
    }
  
    if (phone.length !== 10) {
      showError("Phone number must have exactly 10 digits");
      return;
    }

    try {
      setIsLoading(true)
      let response = await api.post("/api/user/register", {
        email,
        username,
        password,
        phone,
      });
  if(response.status===AppHttpStatusCodes.CREATED){
    setIsLoading(false)
    toast.success(response.data.message);


  }

      Navigate(`/otp-verify/${email}`);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network error or other issue");
      }
    }
  };

  const inputFields: InputField[] = [
    {
      text: "Enter Your Username",
      type: "text",
      value: username,
      handler: (e) => setUsername(e.target.value),
    },
    {
      text: "Enter Your Email",
      type: "email",
      value: email,
      handler: (e) => setEmail(e.target.value),
    },
    {
      text: "Enter Your Password",
      type: "password",
      value: password,
      handler: (e) => setPassword(e.target.value),
    },
    {
      text: "Confirm Your Password",
      type: "password",
      value: confirmPassword,
      handler: (e) => setConfirmPassword(e.target.value),
    },
    {
      text: "Enter Your Phone Number",
      type: "number",
      value: phone,
      handler: (e) => setPhone(e.target.value),
    },
  ];
  const user=useSelector((state:any)=>state.user.user)
  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[])

  return (
    <>
      <div className="container w-full flex px-5 gap-3  mb-3">
        <div
          style={{
            backgroundImage:
              "URL('/assets/Woman_in_Gold_RVB_72dpi_desktop.webp')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="left-container w-2/5 bg-blue-200  "
        ></div>
        <div className="right-container w-3/5 bg-secondary flex flex-col items-center justify-start pt-2">
          <h1 className="font-Bowly text-4xl ">Register Page</h1>
          <div className="Logos flex items-center gap-3 mt-2">
            <GoogleAuth text="SignUp with Google" />
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-7">
            {inputFields.map((field, index) => (
              <Input
                key={index}
                text={field.text}
                type={field.type}
                value={field.value}
                inputHandler={field.handler}
              />
            ))}
          </div>
          <Button text={isLoading? <PulseLoader color="#ffff" />:"Register"} ButtonHandler={registerHandler} />
          <Link to="/login" className="text-blue-700 mt-2  hover:text-blue-900">
            Already have an Account ?
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
