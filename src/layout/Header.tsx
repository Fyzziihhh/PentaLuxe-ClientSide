import  { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SearchIcon from "../components/SearchIcon/SearchIcon";
import { FaUserAlt } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import api from "../services/apiService";
import { AxiosError } from "axios";

const Header = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const ImgUrl = "/assets/PentaLuxeLogo.png";
  

  const onProfileClick = () => {
    setIsOpen((prev) => !prev);
    setIsActive((prev) => !prev);
  };

  const logoutHandler = async () => {
    try {
      let response = await api.post("/api/user/logout");

      if (response.data.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null); // Force state update after logout
        alert("Logout Successful");
      } else {
        alert("Something went wrong while logout");
      }
    } catch (error) {
      if(error instanceof AxiosError) alert(error.response?.data.message);
    }
  };

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
  }, [accessToken]);

  return (
    <nav className="flex justify-between items-center w-full h-14 p-10">
      <ul className="flex gap-10 px-7 py-4 text-lg ">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-slate-600 font-semibold"
                : "text-white font-semibold"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="about"
            className={({ isActive }) =>
              isActive
                ? "text-slate-600 font-semibold"
                : "text-white font-semibold"
            }
          >
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to="products"
            className={({ isActive }) =>
              isActive
                ? "text-slate-600 font-semibold"
                : "text-white font-semibold"
            }
          >
            Products
          </NavLink>
        </li>
      </ul>
      <img className="w-72 h-auto mr-36" src={ImgUrl} alt="Test Image" />
      <div className="nav-right flex items-center gap-10">
        <SearchIcon />
        {accessToken ? (
          <div
            className="user-profile relative inline-block"
            onClick={onProfileClick}
          >
            <FaUserAlt
              size={32}
              className={`cursor-pointer ${
                isActive ? "text-blue-500" : "text-gray-700"
              } transition-colors duration-300`}
            />

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg">
                <ul className="py-1">
                  <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    Profile
                  </li>
                  <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </li>
                  <li
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={logoutHandler}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M16 14a5 5 0 0 1 5 5v2a1 1 0 1 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 1 1-2 0v-2a5 5 0 0 1 5-5zm4-6a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1V9a1 1 0 0 1 1-1m-8-6a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6"/></g></svg></Link>
        )}
        <FaRegHeart size={35} />
        <div className="relative">
          <FaCartShopping size={39} />
          <div className="w-5 h-5 bg-green-600 text-zinc-300 rounded-full absolute -top-2 -right-1 flex justify-center items-center">
            0
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
