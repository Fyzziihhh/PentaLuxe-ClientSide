import React from "react";
import { NavLink } from "react-router-dom";
import SearchIcon from "../components/SearchIcon/SearchIcon";
import { FaUserAlt } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";

const Header = () => {
  const ImgUrl = "/assets/Screenshot_2024-07-31_111544-removebg-preview.png";
  return (
    <nav className="flex justify-between items-center w-full h-14  p-10">
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
        <FaUserAlt size={32} />
        <FaRegHeart size={35} />
        <div className="relative">
        <FaCartShopping size={39} />
        <div className="w-5 h-5  bg-green-600 text-zinc-300 rounded-full absolute -top-2 -right-1 flex justify-center items-center">
                0
        </div>
        </div>

      </div>
    </nav>
  );
};

export default Header;



