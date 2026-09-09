import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineAcademicCap,
  HiOutlineCube,
  HiOutlinePhotograph,
  HiOutlineMail,
  HiOutlineClipboardList,
  HiOutlinePencilAlt,
  HiOutlineCog,
  HiOutlineLogout,
  HiMenu,
  HiX,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: HiOutlineViewGrid, end: true },
  { to: "/admin/courses", label: "Manage Courses", icon: HiOutlineAcademicCap },
  { to: "/admin/projects", label: "Manage Projects", icon: HiOutlineCube },
  { to: "/admin/gallery", label: "Manage Gallery", icon: HiOutlinePhotograph },
  { to: "/admin/messages", label: "Contact Messages", icon: HiOutlineMail },
  { to: "/admin/enrollments", label: "Enrollments", icon: HiOutlineClipboardList },
  { to: "/admin/content", label: "Site Content", icon: HiOutlinePencilAlt },
  { to: "/admin/settings", label: "Settings", icon: HiOutlineCog },
];

const SidebarContent = ({ onLogout, onNavigate }) => (
  <>
    <div className="flex h-16 shrink-0 items-center px-6 font-display text-lg font-semibold text-white">
      Sritech <span className="ml-1 text-brand-400">Admin</span>
    </div>
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `admin-nav-link flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-brand-500/15 text-brand-400" : "text-mist/80 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="shrink-0 border-t border-white/10 p-3">
      <button
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-mist/70 hover:bg-white/5 hover:text-white"
      >
        <HiOutlineLogout size={18} />
        Logout
      </button>
    </div>
  </>
);

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const activeLabel = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )?.label || "Admin";

  return (
    <div className="flex min-h-screen bg-mist">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-navy-950 text-mist/80 md:flex">
        <SidebarContent onLogout={handleLogout} onNavigate={() => {}} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col overflow-y-auto bg-navy-950 text-mist/80 md:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 text-mist/60 hover:text-white"
                aria-label="Close menu"
              >
                <HiX size={22} />
              </button>
              <SidebarContent onLogout={handleLogout} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-black/5 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-md text-navy-900 hover:bg-mist"
              aria-label="Open menu"
            >
              <HiMenu size={22} />
            </button>
            <span className="font-display text-base font-semibold text-navy-900">{activeLabel}</span>
          </div>
          <div className="ml-auto text-sm text-steel">
            Signed in as <span className="font-medium text-navy-900">{admin?.name}</span>
          </div>
        </header>
        <main key={location.pathname} className="admin-page-enter flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
