import PasswordToggleButton from "@/components/PasswordToggleButton";
import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import { AxiosError } from "axios";
import  { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
interface IUser {
 isPassword:boolean
}

const ChangePassword = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate=useNavigate()
  const getUserProfile = async () => {
    try {
      const res = await api.get("/api/user/profile");
      if (res.status === AppHttpStatusCodes.OK) setUser(res.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === AppHttpStatusCodes.NOT_FOUND)
          toast.error(error.response?.data.message);
        if (error.response?.status === AppHttpStatusCodes.UNAUTHORIZED)
          navigate("/login");
      }
    }
  };
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasError, setHasError] = useState(false);
  
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if(user?.isPassword&&currentPassword.trim()===''){
       setError("Current Password is required")
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      setHasError(true);
      confirmPasswordRef.current?.focus();
    } else {
      try {
        const res = await api.patch("/api/user/change-password", {
          currentPassword,
          newPassword,
        });
        if (res.status === AppHttpStatusCodes.OK) {
          setSuccess("Password changed successfully");
          setError("");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setHasError(false);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data.message);
          setSuccess("");
          setHasError(true);
          currentPasswordRef.current?.focus();
        }
      }
    }
  };
  
  useEffect(()=>{
    getUserProfile()
  },[])
  return (
    <div className="flex items-center justify-center min-h-full bg-gray-900 py-9 -mt-">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-white mb-4">
          Change Password
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-400 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
         {user?.isPassword&& <div className="mb-4">
            <label className="block text-gray-300 mb-1">Current Password</label>
            <div className="flex w-full relative">
              <input
                ref={currentPasswordRef}
                type={isCurrentPasswordVisible ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full p-3 border rounded bg-gray-700 text-white focus:outline-none transition ${
                  hasError ? "border-red-500 focus:ring focus:ring-red-500" : "border-gray-600 focus:ring focus:ring-blue-500"
                }`}
                
              />
               {
              currentPassword.length>0&&  <div className="absolute right-1 top-3">
              <PasswordToggleButton onClick={(visible: boolean) => setIsCurrentPasswordVisible(visible)} />
            </div>
            }
            </div>
          </div>}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">New Password</label>
            <div className="flex w-full relative">
              <input
                type={isNewPasswordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
                
              />
              {
              newPassword.length>0&&  <div className="absolute right-1 top-3">
              <PasswordToggleButton onClick={(visible: boolean) => setIsNewPasswordVisible(visible)} />
            </div>
            }
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Confirm New Password</label>
            <div className="flex w-full relative">
              <input
                ref={confirmPasswordRef}
                type={isConfirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 border rounded bg-gray-700 text-white focus:outline-none transition ${
                  hasError && newPassword !== confirmPassword
                    ? "border-red-500 focus:ring focus:ring-red-500"
                    : "border-gray-600 focus:ring focus:ring-blue-500"
                }`}
              
              />
            {
              confirmPassword.length>0&&  <div className="absolute right-1 top-3">
              <PasswordToggleButton onClick={(visible: boolean) => setIsConfirmPasswordVisible(visible)} />
            </div>
            }
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 transition"
            >
              Change Password
            </button>
            <button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
