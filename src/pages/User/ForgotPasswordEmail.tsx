import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
const navigate=useNavigate()
  const SendOtp = async() => {
    // Simulate sending the reset link
 try {
    const res=await api.post('/api/user/send-rest-otp',{email})
    if(res.status===AppHttpStatusCodes.OK){

    setMessage(res.data.message)
  setTimeout(()=>{
    navigate('/forgot-password/otp',{state:{email}})
  },1500)
    } 
 } catch (error) {
    if(error instanceof AxiosError){
        setMessage(error.response?.data.message)
    }
 }
      

  };

  return (
    <div className="flex items-center justify-center h-[420px] bg-gray-900 text-white">
      {/* Card Container */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h1>

        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-3 text-lg border border-gray-600 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />

        {/* Submit Button */}
        <button
          onClick={SendOtp}
          className="w-full py-3 text-lg font-semibold text-gray-900 bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
        >
          Send Reset OTP
        </button>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center text-lg ${
              message.includes("OTP")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
