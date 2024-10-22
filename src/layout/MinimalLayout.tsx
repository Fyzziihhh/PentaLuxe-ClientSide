
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MinimalLayout = () => {
  const ImgUrl = "/assets/PentaLuxeLogo.png";
  return (
    <>
    <div className="h-screen bg-[#0E101C]">

 
      <div className="w-full flex items-center justify-center h-16 mt-0">
        <img className="w-72 h-36 mr-36" src={ImgUrl} alt="Test Image" />
      </div>
      <main className="mt-5">
        <Outlet />
      </main>

      <Footer />
      </div>
    </>
  );
};

export default MinimalLayout;
