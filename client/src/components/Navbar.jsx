import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { HiMenu, HiX, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";

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
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 text-navy-900 border-b border-slate-200 shadow-sm backdrop-blur dark:bg-navy-950/90 dark:text-white dark:border-white/10 dark:shadow-lg dark:shadow-navy-950/20"
          : "bg-white text-navy-900 border-b border-slate-200 dark:bg-navy-950 dark:text-white dark:border-white/5"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/admin/login" className="flex items-center gap-2.5 shrink-0" aria-label="SriTech Solutions Admin / Home">
          <img src="/sritech-logo.svg" alt="Sritech Solutions logo" className="h-9 w-9 rounded-md object-cover" />
          <span className="font-display text-lg font-bold tracking-tight text-navy-900 dark:text-white">
            Sritech <span className="text-brand-500">Solutions</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-600 font-semibold dark:bg-white/10 dark:text-brand-400"
                    : "text-slate-600 hover:text-navy-950 hover:bg-slate-100/70 dark:text-mist/80 dark:hover:text-white dark:hover:bg-white/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right Actions: Theme Switcher, Get in Touch CTA, Hamburger */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 hover:text-navy-950 dark:border-white/10 dark:bg-white/5 dark:text-mist dark:hover:bg-white/10 dark:hover:text-white"
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDark ? (
              <HiOutlineSun size={18} className="text-yellow-400" />
            ) : (
              <HiOutlineMoon size={18} className="text-slate-700" />
            )}
          </button>

          {/* Get in Touch CTA Button */}
          <Link
            to="/contact"
            className="btn-primary !px-4 !py-2 text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-sm"
          >
            Get in Touch
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-navy-900 lg:hidden dark:border-white/10 dark:text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-200 bg-white lg:hidden dark:border-white/10 dark:bg-navy-900"
          >
            <div className="container-page flex flex-col gap-1.5 py-4">
              {/* Navigation Links */}
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-50 text-brand-600 font-semibold dark:bg-white/10 dark:text-brand-400"
                        : "text-slate-700 hover:bg-slate-100 dark:text-mist/80 dark:hover:bg-white/5 dark:hover:text-white"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}

              <div className="pt-2">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
