import React, { ChangeEvent, useState } from 'react'
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import api from '../../services/apiService';
const OtpVerifyPage = () => {
   const [otp,setOtp]=useState('')
 const navigate=  useNavigate()

    const {id}=useParams()
    const resendOTP=()=>{

    }

    const otpVerification = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            let response = await api.post('/api/user/otp-verify', { otp, email: id });
              if(response.data.success){

                  alert('OTP verified successfully');
                  navigate('/'); 
              }
        } catch (error) {
            alert(error?.data?.message)
        }
    };
    const cancelHandler=( )=>{
        navigate('/register')
    
    }
    function otpHandler(event: ChangeEvent<HTMLInputElement>): void {
               setOtp(prev=>prev+=event.target.value)
    }

  return (
  <>
  <div className="otp-container   pr-24 ">
  <div className='w-2/5 h-[25.1rem]  bg-secondary mx-auto my-10 flex items-center justify-start flex-col pr-10 '>
  <MdOutlineMarkEmailUnread size={80}/>
  <p className='font-gilroy'>Please Check Your Email</p>
  <p className='font-gilroy'>We’ve sent a code to <span className='font-bold'>{id}</span> </p>

  <div className="otp-box-container flex  gap-4 mt-5">
    <input onChange={otpHandler} maxLength={1} type="text" className="otp-input w-20 h-20 bg-white text-black font-Bowly text-4xl text-center rounded-xl cursor-pointer"  />
    <input onChange={otpHandler} maxLength={1} type="text" className="otp-input w-20 h-20 bg-white text-black font-Bowly text-4xl text-center rounded-xl cursor-pointer" />
    <input onChange={otpHandler} maxLength={1} type="text" className="otp-input w-20 h-20 bg-white text-black font-Bowly text-4xl text-center rounded-xl cursor-pointer" />
    <input onChange={otpHandler} maxLength={1} type="text" className="otp-input w-20 h-20 bg-white text-black font-Bowly text-4xl text-center rounded-xl cursor-pointer" />
   

  </div>
  <p className='mt-5'>Didn’t Get The Code?  <span className='text-blue-700 underline cursor-pointer '>Click to Resend</span></p>
  <div className="buttons flex gap-5">
  <Button text='Cancel' paddingVal={5} ButtonHandler={cancelHandler} />
  <Button text='Verify' paddingVal={5} ButtonHandler={otpVerification} />
  </div>
  </div>

  </div>
  </>
  )
}

export default OtpVerifyPage