import { useEffect, useState } from "react";
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker, HiOutlineClock } from "react-icons/hi";
import api from "../services/api.js";
import { parsePhoneNumbers, parseEmailAddresses, formatMailtoLink, DEFAULT_CONTACT } from "../utils/contactUtils.js";

const TopBar = () => {
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

  return (
    <div className="bg-slate-100 text-slate-700 border-b border-slate-200 text-xs transition-colors duration-200 dark:bg-navy-950 dark:text-mist/70 dark:border-white/10">
      <div className="container-page flex flex-wrap items-center justify-between py-2 gap-y-1.5 gap-x-4">
        {/* Left: Contact Info */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <div className="flex items-center gap-1.5 font-medium">
            <HiOutlinePhone className="text-brand-500 shrink-0" size={14} />
            <span className="text-slate-500 dark:text-mist/50">Call:</span>
            <div className="flex items-center gap-1.5">
              {phones.map((p, idx) => (
                <span key={p.tel + p.display} className="inline-flex items-center">
                  <a
                    href={p.tel}
                    className="font-semibold text-slate-800 hover:text-brand-600 transition-colors dark:text-mist dark:hover:text-brand-400"
                    title={`Click to call ${p.display}`}
                  >
                    {p.display}
                  </a>
                  {idx < phones.length - 1 && <span className="mx-1 text-slate-300 dark:text-white/20">/</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <HiOutlineMail className="text-brand-500 shrink-0" size={14} />
            <div className="flex items-center gap-1.5">
              {emails.map((em, idx) => (
                <span key={em} className="inline-flex items-center">
                  <a
                    href={formatMailtoLink(em)}
                    className="hover:text-brand-600 transition-colors dark:hover:text-brand-400 font-medium"
                    title={`Launch Microsoft Outlook for ${em}`}
                  >
                    {em}
                  </a>
                  {idx < emails.length - 1 && <span className="mx-1 text-slate-300 dark:text-white/20">|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Location & Working Hours */}
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-500 dark:text-mist/60">
          <span className="flex items-center gap-1">
            <HiOutlineLocationMarker className="text-brand-500 shrink-0" size={13} />
            <span>Dwarakanagar, Visakhapatnam</span>
          </span>
          <span className="text-slate-300 dark:text-white/20">|</span>
          <span className="flex items-center gap-1">
            <HiOutlineClock className="text-brand-500 shrink-0" size={13} />
            <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
