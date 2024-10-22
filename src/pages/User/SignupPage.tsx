import React, { useState } from "react";
import Button from "../../components/Button/Button";
import InputBox from "../../components/InputBox";
import { Link } from "react-router-dom";
import api from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../../components/GoogleAuthentication/GoogleAuth";
import {toast}from 'sonner'
import Input from "@/components/Input/Input";

interface Errors {
  usernameError?: string;
  passwordError?: string;
  emailError?: string;
  phoneError?:string;
}

interface InputField {
  text: string;
  type: string;
  value: string;
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}



const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone,setPhone]=useState('')
  const [errors, setError] = useState<Errors>({});
  const Navigate = useNavigate();

  const registerHandler = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    const errors: Errors = {};
    if (username.trim() === "") {
      errors.usernameError = "Username is required";
      toast.error(errors.usernameError);
    }
    if (email.trim() === "") {
      errors.emailError = "Email is required";
      toast.error(errors.emailError);
    }
    if (password.trim() === "" && confirmPassword.trim() === "") {
      errors.passwordError = "password is required";
      toast.error(errors.passwordError);
    }

    if (password !== confirmPassword) {
      errors.passwordError = "Passwords don't match";
      toast.error(errors.passwordError);
    }
    if(phone.length<10){
      errors.phoneError="Phone Number Must have 10 digits";
      toast.error(errors.phoneError)
    }

    if (Object.keys(errors).length > 0) {
      return setError(errors);
    }

    try {
      let response = await api.post("/api/user/register", {
        email,
        username,
        password,
        phone
      });
      
      toast.success(response.data.message)
  
      Navigate(`/otp-verify/${email}`);
    } catch (error: any) {
      if (error.response) {
      
        toast.error(error.response.data.message);
       
      } else {
        toast.error('Network error or other issue');
      
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
           <GoogleAuth text="SignUp with Google"/>
           
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
          <Button text="Register" ButtonHandler={registerHandler} />
          <Link to="/login" className="text-blue-700 mt-2  hover:text-blue-900">
            Already have an Account ?
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
