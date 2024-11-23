
import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import  { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const location=useLocation()
 const email=location.state?.email
 const navigate=useNavigate()
  const handleReset = async() => {
    setMessage('')
    if (!newPassword || !confirmPassword) {
       
      setMessage("Please fill in both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }
    try {
        const res=await api.patch('/api/user/reset-password',{newPassword,email})
       
        if(res.status===AppHttpStatusCodes.OK){
            setMessage(res.data.message)
            setTimeout(()=>{
             navigate('/login')
            },1500)
        }
    } catch (error) {
        if(error instanceof AxiosError){
            setMessage(error.response?.data.message)
        }
    }
  };

  return (
    <div className="flex items-center justify-center h-[430px] bg-gray-900 text-white">
      {/* Card Container */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>

        {/* New Password Input */}
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full p-3 text-lg border border-gray-600 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />

        {/* Confirm Password Input */}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full p-3 text-lg border border-gray-600 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />

        {/* Reset Password Button */}
        <button
          onClick={handleReset}
          className="w-full py-3 text-lg font-semibold text-gray-900 bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
        >
          Reset Password
        </button>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center text-lg ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
