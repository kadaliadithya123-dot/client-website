import { useEffect, useState } from "react";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineExternalLink } from "react-icons/hi";
import api from "../services/api.js";
import { formatTelLink, formatMailtoLink, DEFAULT_CONTACT } from "../utils/contactUtils.js";

const GoogleMapSection = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setSettings(res.data.data))
      .catch(() => {});
  }, []);

  const address = settings?.address || DEFAULT_CONTACT.address;
  const phone =
    settings?.phones?.[0] ||
    (settings?.phone ? settings.phone.split(/[/|,]/)[0].trim() : DEFAULT_CONTACT.primaryPhone);
  const email =
    settings?.emails?.[0] ||
    (settings?.email ? settings.email.split(/[,/|]/)[0].trim() : DEFAULT_CONTACT.email);
  const mapEmbedUrl = settings?.mapEmbedUrl || DEFAULT_CONTACT.mapsEmbedUrl;
  const mapsUrl = DEFAULT_CONTACT.mapsUrl;

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-14 transition-colors duration-200 dark:border-white/10 dark:bg-navy-900/60">
      <div className="container-page">
        {/* Header & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <span className="eyebrow inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
              <HiOutlineLocationMarker size={16} /> Location & Center
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl dark:text-white">
              Visit Our Center in Visakhapatnam
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-mist/70">
              {address}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-500/30 bg-brand-500/10 px-3.5 py-2 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white dark:border-brand-400/30 dark:bg-brand-500/20 dark:text-brand-300 dark:hover:bg-brand-500 dark:hover:text-white"
            >
              <span>Get Directions</span>
              <HiOutlineExternalLink size={14} />
            </a>

            <a
              href={formatTelLink(phone)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-mist dark:hover:bg-white/10 dark:hover:text-white"
              title="Call for Directions"
            >
              <HiOutlinePhone size={14} className="text-brand-500" />
              <span>Call Us</span>
            </a>

            <a
              href={formatMailtoLink(email)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-mist dark:hover:bg-white/10 dark:hover:text-white"
              title="Launch Microsoft Outlook / Email Client"
            >
              <HiOutlineMail size={14} className="text-brand-500" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Embedded Responsive Google Map Container */}
        <div className="relative w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-md dark:border-white/10 dark:bg-navy-950">
          <iframe
            title="Sritech Solutions Location Map - Visakhapatnam"
            src={mapEmbedUrl}
            width="100%"
            height="360"
            className="w-full h-72 sm:h-96 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default GoogleMapSection;
