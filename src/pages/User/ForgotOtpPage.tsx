import api from '@/services/apiService';
import { AppHttpStatusCodes } from '@/types/statusCode';
import { AxiosError } from 'axios';
import  { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ForgotOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate=useNavigate()
  const location=useLocation()
 const email=location.state?.email
  // Simulate OTP verification
  const verifyOtp = async() => {
    setMessage('')
   if(otp.trim()===''){
    setMessage("Otp is Required")
    return 
  }
   try {
    const res=await api.post('/api/user/verfiy-rest-otp',{otp,email})
    if(res.status===AppHttpStatusCodes.OK){
       setMessage(res.data.message)
     setTimeout(()=>{
      navigate('/reset-password',{state:{email}})
     },1500)
    }
   } catch (error) {
     if(error instanceof AxiosError){
      setMessage(error.response?.data.message)
     }
   }
   
  };

  return (
    <div className="flex items-center justify-center h-[470px] bg-gray-900 text-white">
      {/* Card Container */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg ">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center mb-6">Verify OTP</h1>

        {/* OTP Input */}
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-3 text-lg border border-gray-600 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />

        {/* Verify Button */}
        <button
          onClick={verifyOtp}
          className="w-full py-3 text-lg font-semibold text-gray-900 bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
        >
          Verify OTP
        </button>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center text-lg ${
              message.includes('✅') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}

        {/* Footer */}
       
      </div>
    </div>
  );
};

export default ForgotOtpPage;
