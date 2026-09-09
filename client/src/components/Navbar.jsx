import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/courses", label: "Courses" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy-900/95 shadow-lg shadow-navy-950/20 backdrop-blur" : "bg-navy-900"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/admin/login" className="flex items-center gap-2 text-white">
          <img src="/sritech-logo.svg" alt="Sritech Solutions logo" className="h-9 w-9 rounded-md object-cover" />
          <span className="font-display text-lg font-semibold tracking-tight">
            Sritech <span className="text-brand-400">Solutions</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-brand-400" : "text-mist/80 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/projects" className="btn-primary ml-2 !px-5 !py-2.5">
            Explore Projects
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-md text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-navy-900 md:hidden"
          >
            <div className="container-page flex flex-col gap-1 pb-5">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2.5 text-sm font-medium ${
                      isActive ? "bg-white/5 text-brand-400" : "text-mist/80"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
