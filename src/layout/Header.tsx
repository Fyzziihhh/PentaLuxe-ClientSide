import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SearchIcon from "../components/SearchIcon/SearchIcon";
import { FaUserAlt } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import api from "../services/apiService";

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
      
      alert(error?.response?.data?.message);
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
          <Link to="/login">Login</Link>
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
