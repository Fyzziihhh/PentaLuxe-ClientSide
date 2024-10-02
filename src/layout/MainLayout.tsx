
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const MainLayout = () => {
  return (
  <>
  <div className="h-screen">
      <Header />
      
    

      <Outlet />
      
    

      <Footer />
      </div>
  </>
  
  );
};

export default MainLayout;
