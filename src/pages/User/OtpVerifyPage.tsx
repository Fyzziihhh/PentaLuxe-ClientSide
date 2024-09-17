import React, { ChangeEvent, useEffect, useState } from "react";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import api from "../../services/apiService";
import { toast } from "sonner";
import { AxiosError } from "axios";
const OtpVerifyPage = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(120);
  const { id } = useParams();
  const resendOTP = async () => {
    try {
      const response = await api.post("/api/user/resend-otp", { email: id });
      if (response.data.success) {
        toast.success("OTP has been resent. Please check your email.");
        setOtp(["", "", "", ""]);
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error(
        `An error occurred while resending the OTP. Please try again later`
      );
    }
  };

  const otpVerification = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      let otpCode = otp.join("");
      toast.success(otpCode);
      let response = await api.post("/api/user/otp-verify", {
        otp: otpCode,
        email: id,
      });
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const errorMsg =
          error?.response?.data?.message || "An Unexpected error Occurs";
        toast.error(errorMsg);
      }
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

  useEffect(() => {
    if (seconds === 0) return;
    const interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

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
          <p className="mt-5 text-center ">
            {!(seconds > 0) ? " Didn’t Get The Code? " : ""}
            <button
              className={`text-blue-700 bg-white rounded-lg p-2 cursor-pointer ${
                seconds > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={resendOTP}
              disabled={seconds > 0}
            >
              {seconds > 0
                ? `Resend in ${Math.floor(seconds / 60)}:${seconds % 60}`
                : "Click to Resend OTP"}
            </button>
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
