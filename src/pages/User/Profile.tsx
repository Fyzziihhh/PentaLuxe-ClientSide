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
        [field]: field === "phone" ? Number(e.target.value) : e.target.value,
      });
    }
  };

  const updateInformations = async () => {
    if (
      user?.email.trim() === "" ||
      user?.phone == null ||
      typeof user.phone !== "number" ||
      user.phone.toString().length < 10 ||
      user?.username.trim() === ""
    ) {
      toast.error("Every field is required to update");
      return;
    }
    try {
      const res = await api.put("/api/user/profile", { user });
      if (res.status === AppHttpStatusCodes.OK) {
        toast.success(res.data.message);
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className="flex items-center justify-center h-full bg-gray-900 -mt-5 py-10">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-4">Personal Information</h1>
        <p className="text-gray-400 text-center mb-6">
          Hey there! Fill in your details for a personalized Pentaluxe shopping experience.
        </p>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-300">User Name</span>
            <input
              type="text"
              className="mt-1 block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
              value={user?.username || ""}
              onChange={(e) => handleInputChange(e, "username")}
            />
          </label>
          <label className="block">
            <span className="text-gray-300">Phone</span>
            <input
              type="number"
              className="mt-1 block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
              value={user?.phone || ""}
              onChange={(e) => handleInputChange(e, "phone")}
            />
          </label>
          <label className="block">
            <span className="text-gray-300">Email</span>
            <input
              type="email"
              className="mt-1 block w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
              value={user?.email || ""}
              onChange={(e) => handleInputChange(e, "email")}
            />
          </label>
        </div>
        <button
          onClick={updateInformations}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition duration-300"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
