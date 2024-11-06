import React from "react";
import { BsInstagram } from "react-icons/bs";
import { FaPinterest } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
const Footer = () => {
  return (
    <>
      <div className="px-20 py-6 bg-secondary text-sm font-gilroy h-[34%] ">
        <div className="flex justify-between text-left  ">
          <ul>
            <li className="font-almendra text-lg">About PentaLuxe</li>
            <li className="w-80">
              Discover the art of fragrance with PentaLuxe. We offer a curated
              collection of perfumes for every occasion.
            </li>
          </ul>
          <ul>
            <li>
              <h2 className="font-almendra text-lg">Customer Services</h2>
            </li>
            <li> Contact Us</li>
            <li>FAQs</li>
            <li>Shipping & Returns</li>
            <li>Privacy Policy</li>
          </ul>
          <ul>
            <li className="font-almendra text-lg *:">
              <h2>Our Story</h2>
            </li>
            <li className="w-80">
              PentaLuxe was founded with a passion for fragrances that evoke
              emotions and create lasting memories.Our carefully crafted scents
              are designed to inspire and captivate.
            </li>
          </ul>
          <div>
            <h2 className="font-almendra text-xl">Follow Us</h2>
            <ul className="flex gap-2">
              <li>
                <BsInstagram />
              </li>
              <li>
                <FaPinterest />
              </li>
              <li>
                <FaSquareXTwitter />
              </li>
              <li>
                <FaFacebookSquare />
              </li>
            </ul>
          </div>
          <ul>
            <li>
              <h2 className="font-almendra text-xl ">Legal Information </h2>
            </li>
            <li>Terms & Conditions</li>
            <li>Cookie Policy</li>
            <li>Accessibitily Statement</li>
          </ul>
        </div>
        <p className="text-center mt-10 mr-24 ">
          © 2024 PentaLuxe. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
