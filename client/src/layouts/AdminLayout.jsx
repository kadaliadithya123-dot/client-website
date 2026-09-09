import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineAcademicCap,
  HiOutlineCube,
  HiOutlinePhotograph,
  HiOutlineMail,
  HiOutlineClipboardList,
  HiOutlineCog,
  HiOutlineLogout,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: HiOutlineViewGrid, end: true },
  { to: "/admin/courses", label: "Manage Courses", icon: HiOutlineAcademicCap },
  { to: "/admin/projects", label: "Manage Projects", icon: HiOutlineCube },
  { to: "/admin/gallery", label: "Manage Gallery", icon: HiOutlinePhotograph },
  { to: "/admin/messages", label: "Contact Messages", icon: HiOutlineMail },
  { to: "/admin/enrollments", label: "Enrollments", icon: HiOutlineClipboardList },
  { to: "/admin/settings", label: "Settings", icon: HiOutlineCog },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-mist">
      <aside className="hidden w-64 flex-col bg-navy-950 text-mist/80 md:flex">
        <div className="flex h-16 items-center px-6 font-display text-lg font-semibold text-white">
          Sritech <span className="ml-1 text-brand-400">Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav-link flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-500/15 text-brand-400" : "hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-mist/70 hover:bg-white/5 hover:text-white"
          >
            <HiOutlineLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white px-6">
          <span className="font-display text-base font-semibold text-navy-900 md:hidden">Sritech Admin</span>
          <div className="ml-auto text-sm text-steel">
            Signed in as <span className="font-medium text-navy-900">{admin?.name}</span>
          </div>
        </header>
        <main key={location.pathname} className="admin-page-enter p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
