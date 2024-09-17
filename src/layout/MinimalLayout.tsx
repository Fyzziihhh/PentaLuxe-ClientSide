
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MinimalLayout = () => {
  const ImgUrl = "/assets/PentaLuxeLogo.png";
  return (
    <>
    <div className="h-screen">

 
      <div className="w-full flex items-center justify-center h-16 mt-0">
        <img className="w-72 h-36 mr-36" src={ImgUrl} alt="Test Image" />
      </div>
      <main>
        <Outlet />
      </main>

      <Footer />
      </div>
    </>
  );
};

export default MinimalLayout;
