import React, { ChangeEvent, useState } from "react";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import api from "../../services/apiService";
const OtpVerifyPage = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const navigate = useNavigate();

  const { id } = useParams();
  const resendOTP = async () => {
    try {
      const response = await api.post("/api/user/resend-otp", { email: id });
      if (response.data.success) {
        alert("OTP has been resent. Please check your email.");
        setOtp(['','','',''])
      } else {
        alert("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert(
        `An error occurred while resending the OTP. Please try again later`
      );
    }
  };

  const otpVerification = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
alert(otp)
    event.preventDefault();
    try {
        let otpCode=otp.join('')
        alert(otpCode)
      let response = await api.post("/api/user/otp-verify", { otp:otpCode, email: id });

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        alert("OTP verified successfully");
        navigate("/");
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "An Unexpected error Occurs";
      alert(errorMsg);
    }
  };
  const cancelHandler = () => {
    navigate("/register");
  };
  function otpHandler(
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ): void {
    const { value } = event.target;
    if (value.length === 1 || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  }

  return (
    <>
      <div className="otp-container   pr-24 ">
        <div className="w-2/5 h-[25.1rem]  bg-secondary mx-auto my-10 flex items-center justify-start flex-col pr-10 ">
          <MdOutlineMarkEmailUnread size={80} />
          <p className="font-gilroy">Please Check Your Email</p>
          <p className="font-gilroy">
            We’ve sent a code to <span className="font-bold">{id}</span>{" "}
          </p>

          <div className="otp-box-container flex  gap-4 mt-5 ">
            {otp.map((digit, index) => (
              <input
                key={index}
                value={digit}
                onChange={(event) => otpHandler(event, index)}
                maxLength={1}
                type="text"
                className="otp-input w-20 h-20 bg-white text-black font-Bowly text-4xl text-center rounded-xl cursor-pointer"
              />
            ))}
          </div>
          <p className="mt-5">
            Didn’t Get The Code?
            <span
              className="text-blue-700 underline cursor-pointer "
              onClick={resendOTP}
            >
              Click to Resend
            </span>
          </p>
          <div className="buttons flex gap-5">
            <Button
              text="Cancel"
              paddingVal={5}
              ButtonHandler={cancelHandler}
            />
            <Button
              text="Verify"
              paddingVal={5}
              ButtonHandler={otpVerification}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerifyPage;
