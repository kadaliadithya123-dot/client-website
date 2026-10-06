import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineExternalLink } from "react-icons/hi";
import api from "../services/api.js";
import { parsePhoneNumbers, parseEmailAddresses, formatMailtoLink, DEFAULT_CONTACT } from "../utils/contactUtils.js";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setSettings(res.data.data))
      .catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post("/contact", data);
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const phones = parsePhoneNumbers(
    settings?.phones && settings.phones.length > 0 ? settings.phones : settings?.phone || DEFAULT_CONTACT.phones
  );
  const emails = parseEmailAddresses(
    settings?.emails && settings.emails.length > 0 ? settings.emails : settings?.email || DEFAULT_CONTACT.emails
  );
  const address = settings?.address || DEFAULT_CONTACT.address;

  return (
    <div className="transition-colors duration-200">
      {/* Header Banner */}
      <section className="border-b border-slate-200 bg-slate-50 py-14 text-navy-950 transition-colors duration-200 dark:border-white/10 dark:bg-navy-900/60 dark:text-white">
        <div className="container-page">
          <span className="eyebrow text-brand-600 dark:text-brand-400">Contact Us</span>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl text-navy-950 dark:text-white">
            Let's talk about your project & training
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-mist/70">
            Have a project idea, thesis guidance requirement, or want to join a technical training track? Reach out to us.
          </p>
        </div>
      </section>

      {/* Main Form and Direct Contact */}
      <section className="container-page grid gap-10 py-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-navy-900 dark:text-white">Reach us directly</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-600 dark:text-mist/80">
            {/* Address */}
            <div className="flex items-start gap-3">
              <HiOutlineLocationMarker className="mt-0.5 shrink-0 text-brand-500" size={20} />
              <div>
                <p className="font-medium text-slate-800 dark:text-mist">{address}</p>
                <a
                  href={DEFAULT_CONTACT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                  <span>Open in Google Maps</span>
                  <HiOutlineExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Click-to-Action Phone Numbers */}
            <div className="flex items-start gap-3">
              <HiOutlinePhone className="mt-0.5 shrink-0 text-brand-500" size={20} />
              <div>
                <span className="text-xs text-slate-500 dark:text-mist/50 block">Click to Call:</span>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {phones.map((p) => (
                    <a
                      key={p.tel}
                      href={p.tel}
                      className="font-semibold text-slate-900 hover:text-brand-600 transition-colors dark:text-white dark:hover:text-brand-400"
                      title={`Call ${p.display}`}
                    >
                      {p.display}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Click-to-Action Email */}
            <div className="flex items-start gap-3">
              <HiOutlineMail className="mt-0.5 shrink-0 text-brand-500" size={20} />
              <div>
                <span className="text-xs text-slate-500 dark:text-mist/50 block">Click to Email (Outlook):</span>
                <div className="flex flex-col gap-1 mt-0.5">
                  {emails.map((em) => (
                    <a
                      key={em}
                      href={formatMailtoLink(em)}
                      className="font-semibold text-slate-900 hover:text-brand-600 transition-colors dark:text-white dark:hover:text-brand-400"
                      title={`Launch Microsoft Outlook for ${em}`}
                    >
                      {em}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Office & Counseling Hours */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-white/10 dark:bg-navy-900/40">
            <h3 className="font-semibold text-navy-900 dark:text-white">Office & Embedded Lab Hours</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-mist/60">
              Visit our center for live hardware demonstrations, career counseling, and project mentorship.
            </p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-600 dark:text-mist/70">Monday – Friday</span>
                <span className="font-semibold text-slate-900 dark:text-white">9:00 AM – 7:30 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-600 dark:text-mist/70">Saturday</span>
                <span className="font-semibold text-slate-900 dark:text-white">9:30 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-mist/70">Sunday</span>
                <span className="font-semibold text-brand-600 dark:text-brand-400">By Appointment / Batches</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-mist/60">
              📍 Full interactive Google Map & directions are available right below.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-navy-900/60"
        >
          <div>
            <label className="text-sm font-medium text-navy-900 dark:text-white">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
              placeholder="Your full name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-navy-900 dark:text-white">Phone</label>
              <input
                {...register("phone", { required: "Phone is required" })}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
                placeholder="10-digit mobile number"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-900 dark:text-white">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
                placeholder="name@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy-900 dark:text-white">Subject</label>
            <input
              {...register("subject", { required: "Subject is required" })}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
              placeholder="e.g. Embedded Project Guidance / Course Inquiry"
            />
            {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-navy-900 dark:text-white">Message</label>
            <textarea
              rows={4}
              {...register("message", { required: "Message is required" })}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
              placeholder="Please describe your project, branch, year or questions..."
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
