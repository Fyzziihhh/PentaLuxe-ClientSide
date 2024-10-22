import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <>
      <div className="h-screen bg-[#0E101C]">
        <Header />

        <div className="bg-[#0E101C]">
          <Outlet />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
