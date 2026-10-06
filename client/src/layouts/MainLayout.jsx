import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import GoogleMapSection from "../components/GoogleMapSection.jsx";
import FloatingContactWidget from "../components/FloatingContactWidget.jsx";
import BackToTop from "../components/BackToTop.jsx";

const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-navy-950 dark:text-mist">
    <TopBar />
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <GoogleMapSection />
    <Footer />
    <FloatingContactWidget />
    <BackToTop />
  </div>
);

export default MainLayout;
