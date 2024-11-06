import { useEffect, useState } from "react";
import api from "../services/apiService";
import { AppHttpStatusCodes } from "../types/statusCode";
import { AxiosError } from "axios";
import {  json, NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface IUser {
  username: string;
  email: string;
  phone: number | string;
}
const sideBarLinks = [
  {
    id: Math.random(),
    name: "Profile",
    path: "/profile",
  },
  {
    id: Math.random(),
    name: "Address Book",
    path: "/profile/address-book",
  },
  {
    id: Math.random(),
    name: "Orders",
    path: "/profile/orders",
  },
  {
    id: Math.random(),
    name: "PentaLuxe Wallet",
    path: "/profile/wallet",
  },

  {
    id: Math.random(),
    name: "Change Password",
    path: "/profile/change-password",
  },
  {
    id: Math.random(),
    name: "Logout",
    path: "/",
  },
];

const UserProfileLayout = () => {
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
  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className=" w-full container   flex gap-9 p-10  px-20 text-white">
      <div className="sidebar w-[25%] rounded-lg bg-secondary px-3 py-4  h-[500px]">
        <div className="user-details flex flex-col items-center gap-1">
          <div className="user-avatar w-20 h-20 bg-gray-200 rounded-full text-center content-center font-bold text-4xl text-gray-400">
            {user?.username.slice(0, 2).toUpperCase()}
          </div>
          <h1 className="text-base font-bold">{user?.username}</h1>
          <p className="text-gray-500 -mt-2 font-bold text-sm mb-2">{user?.email}</p>
        </div>
        <div className="sections flex flex-col gap-2 ">
          {sideBarLinks.map((link) => (
           <NavLink
           key={link.id}
           to={link.path}
           end={link.name!=='Address Book'}
           onClick={()=>{
            link.name==='Logout'&&localStorage.clear()
            navigate('/')
          }}
           className={({ isActive }) =>
             `rounded-md p-3 font-bold transition duration-300  ${
               isActive ? 'text-blue-600 bg-gray-200' : 'text-gray-500 hover:bg-gray-100'
             }`
           }
         >
           {link.name}
         </NavLink>
          ))}
        </div>
      </div>
      <div className="content px-10 py-5 w-[90%]  rounded-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default UserProfileLayout;
