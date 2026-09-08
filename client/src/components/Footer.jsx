import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import api from "../services/api.js";

const socialIcons = [
  { key: "facebook", Icon: FaFacebookF },
  { key: "instagram", Icon: FaInstagram },
  { key: "linkedin", Icon: FaLinkedinIn },
  { key: "youtube", Icon: FaYoutube },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setSettings(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-navy-950 text-mist/70">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-lg font-semibold text-white">
            {settings?.companyName || "SriTech Embedded Projects"}
          </span>
          <p className="mt-3 text-sm leading-relaxed">
            {settings?.about ||
              "Bridging the gap between theoretical learning and industrial applications through practical, innovative embedded systems solutions."}
          </p>
          <div className="mt-4 flex gap-3">
            {socialIcons.map(({ key, Icon }) => (
              <a
                key={key}
                href={settings?.social?.[key] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-md bg-white/5 text-white/70 transition-colors hover:bg-brand-500 hover:text-white"
                aria-label={`${key} link`}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {["/about", "/courses", "/projects", "/gallery", "/contact"].map((path) => (
              <li key={path}>
                <Link to={path} className="capitalize hover:text-brand-400">
                  {path.replace("/", "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">What We Offer</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Embedded System Design</li>
            <li>Industrial Automation</li>
            <li>Final Year Projects</li>
            <li>Research & Training</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{settings?.address || "Andhra Pradesh, India"}</li>
            <li>{settings?.phone || "+91 90000 00000"}</li>
            <li>{settings?.email || "info@sritechembedded.com"}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-mist/50">
        © {year} {settings?.companyName || "SriTech Embedded Projects"}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
