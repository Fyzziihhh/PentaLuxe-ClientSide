import { useEffect, useState } from "react";
import api from "../../services/apiService";
import { AppHttpStatusCodes } from "../../types/statusCode";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface IUser {
  username: string;
  email: string;
  phone: number | string;
}
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof IUser
  ) => {
    if (user) {
      setUser({
        ...user,
        [field]: field === "phone" ? Number(e.target.value) : e.target.value, // Convert phone to number
      });
    }
  };

  const updateInformations = async () => {
    if (
      user?.email.trim() === "" ||
      user?.phone == null || // Check if phone is null or undefined
      typeof user.phone !== "number" ||
      user.phone.toString().length < 10 || // Ensure phone is a number and has the required length
      user?.username.trim() === ""
    ) {
      toast.error("every field is required to Update");
      return;
    }
    try {
      const res = await api.put("/api/user/profile", { user });
      if (res.status === AppHttpStatusCodes.OK) {
        toast.success(res.data.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className="content px-10 py-5 w-[90%] bg-white rounded-lg text-black">
      <div className="head-section text-center">

      <h1 className="text-4xl font-Bowly text-gray-800">Personal Information</h1>
      <p className="text-lg font-almendra">Hey there! Fill in your details for a personalized Pentaluxe shopping experience.</p>
      </div>
      <div className="lables  mt-10 ">
        <label>
          <div className="flex gap-4">
            <p className="font-bold">User Name</p>
          </div>
          <input
            type="text"
            className="border-2 border-gray-300 rounded px-3 py-2 text-black font-bold"
            value={user?.username || ""}
            onChange={(e) => handleInputChange(e, "username")}
          />
        </label>

        <label className="flex flex-col gap-1 font-bold text-black w-[50%] mt-3">
          <div className="flex gap-4">
            <p>Phone</p>
          </div>
          <input
            type="number"
            className="border-2 border-gray-300 rounded px-3 py-2 text-black font-bold"
            value={user?.phone || ""}
            onChange={(e) => handleInputChange(e, "phone")}
          />
        </label>

        <label className="flex flex-col gap-1 font-bold text-black w-[50%] mt-3">
          <div className="flex gap-4">
            <p>Email</p>
          </div>
          <input
            type="email"
            className="border-2 border-gray-300 rounded px-3 py-2 text-black font-bold"
            value={user?.email || ""}
            onChange={(e) => handleInputChange(e, "email")}
          />
        </label>
      </div>

      <button
        onClick={updateInformations}
        className="border flex text-center rounded-lg mt-5 bg-black text-gray-300 p-3 font-bold  hover:text-gray-400"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Profile;





