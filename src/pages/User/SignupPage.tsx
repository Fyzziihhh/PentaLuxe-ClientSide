import React, { useState } from 'react'
import Button from '../../components/Button/Button'
import InputBox from '../../components/InputBox/InputBox'
import { Link } from 'react-router-dom'
import api from '../../services/apiService'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
interface Errors {
  usernameError?: string;
  passwordError?: string;
  emailError?: string;
}
interface User{
message(message: any): unknown

username:string;
email:string;
}

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<Errors>({});
  const Navigate=useNavigate()

  const registerHandler = async (event:React.MouseEvent<HTMLButtonElement>) => {

    event.preventDefault();
    
    const errors: Errors = {};
    if (username.trim() === '') {
      errors.usernameError = "Username is required";
      alert(error.usernameError)
    }
    if (email.trim() === '') {
      errors.emailError = "Email is required";
      alert(error.emailError)
    }
    if(password.trim()===''&& confirmPassword.trim()===''){
      errors.passwordError ='password is required'
      alert(error.passwordError)
    }

    if (password !== confirmPassword) {
      errors.passwordError = "Passwords don't match";
      alert(errors.passwordError)
    }
    


    if (Object.keys(errors).length > 0) {
      return setError(errors);
    }

    try {
      let response = await api.post<User>("/api/user/register", { email, username, password });
     let data=response.data
      
        alert(response.data.message)
      console.log("inside the try catch");
      Navigate(`/otp-verify/${email}`);
      
    } catch (error:any) {
      if (error.response) {
        console.error('Error:', error.response.data.message);
        alert(`Registration failed: ${error.response.data.message}`);
      } else {
        console.error('Network error or other issue');
      }
      
      
    }
  };

  return (
    <>
      <div className="container w-full flex px-10 gap-3 h-[470px] mb-3">
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
          <h1 className="font-Bowly text-4xl ">Register Page</h1>
          <div className="Logos flex items-center gap-3 mt-5">
            <img
              className="w-12 h-12 object-cover"
              src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
              alt=""
            />
            <img
              className="w-10 h-10 object-cover"
              src="https://1000logos.net/wp-content/uploads/2017/02/Facebook-Logosu.png"
              alt=""
            />
          </div>
      <div className="flex flex-col gap-8 mt-5">

          <InputBox
            placeholder=" Username"
            Type="text"
            value={username}
            setValue={setUsername}
          />
          <InputBox
            placeholder="Email"
            Type="email"
            value={email}
            setValue={setEmail}
          />
          <InputBox
            placeholder="Password"
            Type="password"
            value={password}
            setValue={setPassword}
          />
          <InputBox
            placeholder="Confirm Password"
            Type="password"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
      </div>
          <Button text="Register" ButtonHandler={registerHandler} />
          <Link to='/login' className="text-blue-700 mt-2  hover:text-blue-900">
         Already have an Account ?</Link>
        </div>
      </div>
    </>
  )
}

export default SignupPage