import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import UniversityFooter from "./UniversityFooter";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 ml-60 pt-20">
          <Outlet />
        </main>
      </div>
      <div className="ml-60">
        {user?.role === "university" ? <UniversityFooter /> : <Footer />}
      </div>
    </div>
  );
};

export default Layout;
