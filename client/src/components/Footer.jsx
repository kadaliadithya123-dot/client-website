import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import api from "../services/api.js";
import { parsePhoneNumbers, parseEmailAddresses, formatMailtoLink, DEFAULT_CONTACT } from "../utils/contactUtils.js";

const socialIcons = [
  { key: "facebook", Icon: FaFacebookF },
  { key: "instagram", Icon: FaInstagram },
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

  const phones = parsePhoneNumbers(
    settings?.phones && settings.phones.length > 0 ? settings.phones : settings?.phone || DEFAULT_CONTACT.phones
  );
  const emails = parseEmailAddresses(
    settings?.emails && settings.emails.length > 0 ? settings.emails : settings?.email || DEFAULT_CONTACT.emails
  );
  const address = settings?.address || DEFAULT_CONTACT.address;

  return (
    <footer className="bg-slate-100 text-slate-700 border-t border-slate-200 transition-colors duration-200 dark:bg-navy-950 dark:text-mist/70 dark:border-white/10">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Company Overview */}
        <div>
          <span className="font-display text-lg font-bold text-navy-950 dark:text-white">
            {settings?.companyName || "Sritech Solutions"}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-mist/70">
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
                className="grid h-9 w-9 place-items-center rounded-md bg-white border border-slate-200 text-slate-700 transition-colors hover:bg-brand-500 hover:text-white hover:border-brand-500 dark:bg-white/5 dark:border-transparent dark:text-white/70 dark:hover:bg-brand-500 dark:hover:text-white"
                aria-label={`${key} link`}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-navy-950 dark:text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {["/about", "/courses", "/projects", "/gallery", "/contact"].map((path) => (
              <li key={path}>
                <Link to={path} className="capitalize hover:text-brand-600 transition-colors dark:hover:text-brand-400">
                  {path.replace("/", "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* What We Offer */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-navy-950 dark:text-white">What We Offer</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Embedded System Design</li>
            <li>Industrial Automation</li>
            <li>Final Year Projects</li>
            <li>Research & Training</li>
            <li>IoT & AI Edge Solutions</li>
          </ul>
        </div>

        {/* Contact with Click-to-Action Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-navy-950 dark:text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <HiOutlineLocationMarker className="mt-0.5 shrink-0 text-brand-500" size={16} />
              <span>{address}</span>
            </li>
            <li className="flex items-start gap-2">
              <HiOutlinePhone className="mt-0.5 shrink-0 text-brand-500" size={16} />
              <div className="flex flex-col gap-1">
                {phones.map((p) => (
                  <a
                    key={p.tel + p.display}
                    href={p.tel}
                    className="font-medium text-slate-800 hover:text-brand-600 transition-colors dark:text-mist dark:hover:text-brand-400"
                    title={`Click to call ${p.display}`}
                  >
                    {p.display}
                  </a>
                ))}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <HiOutlineMail className="mt-0.5 shrink-0 text-brand-500" size={16} />
              <div className="flex flex-col gap-1">
                {emails.map((em) => (
                  <a
                    key={em}
                    href={formatMailtoLink(em)}
                    className="font-medium text-slate-800 hover:text-brand-600 transition-colors dark:text-mist dark:hover:text-brand-400 truncate"
                    title={`Email ${em} (Outlook)`}
                  >
                    {em}
                  </a>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-600 transition-colors dark:border-white/10 dark:text-mist/50">
        © {year} {settings?.companyName || "Sritech Solutions"}. All rights reserved.
        <span className="mx-2 text-slate-300 dark:text-white/20">|</span>
        Designed by{" "}
        <a
          href="https://editncode.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 font-medium transition-colors hover:underline dark:text-brand-400 dark:hover:text-brand-300"
        >
          Editncode
        </a>
      </div>
    </footer>
  );
};

export default Footer;
