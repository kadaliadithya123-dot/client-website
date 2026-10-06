import { useEffect, useState } from "react";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { HiX, HiOutlineChatAlt2 } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { formatTelLink, formatWhatsAppLink, formatMailtoLink, DEFAULT_CONTACT } from "../utils/contactUtils.js";

const FloatingContactWidget = () => {
  const [settings, setSettings] = useState(null);
  const [isOpen, setIsOpen] = useState(true); // Default open for immediate accessibility

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setSettings(res.data.data))
      .catch(() => {});
  }, []);

  const phone = settings?.whatsapp || settings?.phone || DEFAULT_CONTACT.whatsapp;
  const primaryPhone = settings?.phone ? settings.phone.split(/[/|,]/)[0].trim() : DEFAULT_CONTACT.primaryPhone;
  const email = settings?.email || DEFAULT_CONTACT.email;

  const actions = [
    {
      id: "whatsapp",
      label: "Chat on WhatsApp",
      href: formatWhatsAppLink(phone),
      icon: FaWhatsapp,
      bgColor: "bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[#25D366]/40",
      target: "_blank",
      rel: "noopener noreferrer",
      ariaLabel: "Chat with SriTech on WhatsApp",
    },
    {
      id: "call",
      label: `Call Us (${primaryPhone})`,
      href: formatTelLink(primaryPhone),
      icon: FaPhoneAlt,
      bgColor: "bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/40",
      target: "_self",
      rel: "",
      ariaLabel: `Call SriTech at ${primaryPhone}`,
    },
    {
      id: "email",
      label: "Email Us (Outlook)",
      href: formatMailtoLink(email),
      icon: FaEnvelope,
      bgColor: "bg-[#0078D4] hover:bg-[#006abc] text-white shadow-[#0078D4]/40",
      target: "_self",
      rel: "",
      ariaLabel: `Email SriTech via Outlook at ${email}`,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-end gap-2.5 pointer-events-auto"
          >
            {actions.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="group flex items-center gap-2">
                  {/* Tooltip Label */}
                  <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md bg-navy-900/90 px-2.5 py-1 text-xs font-medium text-white shadow-md backdrop-blur whitespace-nowrap">
                    {act.label}
                  </span>

                  {/* Action Button */}
                  <a
                    href={act.href}
                    target={act.target}
                    rel={act.rel}
                    aria-label={act.ariaLabel}
                    className={`grid h-12 w-12 place-items-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 ${act.bgColor}`}
                  >
                    <Icon size={20} />
                  </a>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle / Hub Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close contact options" : "Open contact options (Call, WhatsApp, Email)"}
        className="pointer-events-auto grid h-14 w-14 place-items-center rounded-full bg-navy-900 text-white shadow-xl shadow-black/25 ring-2 ring-white/20 transition-transform hover:scale-105 active:scale-95 dark:bg-brand-500"
      >
        {isOpen ? <HiX size={24} /> : <HiOutlineChatAlt2 size={26} className="animate-pulse" />}
      </button>
    </div>
  );
};

export default FloatingContactWidget;
