import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import api from "../services/api.js";

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

  return (
    <div>
      <section className="bg-navy-950 py-14 text-white">
        <div className="container-page">
          <span className="eyebrow text-brand-400">Contact</span>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Let's talk about your project</h1>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-navy-900">Reach us directly</h2>
          <div className="mt-5 space-y-4 text-sm text-steel">
            <p className="flex items-start gap-3">
              <HiOutlineLocationMarker className="mt-0.5 shrink-0 text-brand-500" size={20} />
              {settings?.address || "Sritech Solutions, Ratnaveni Complex, 1st Lane, Dwarakanagar, Visakhapatnam - 530016"}
            </p>
            <p className="flex items-center gap-3">
              <HiOutlinePhone className="text-brand-500" size={20} />
              {settings?.phone || "99488-32456 / 86886-32456"}
            </p>
            <p className="flex items-center gap-3">
              <HiOutlineMail className="text-brand-500" size={20} />
              {settings?.email || "sritechsolutions9@gmail.com"}
            </p>
          </div>

          <div className="mt-8 aspect-video overflow-hidden rounded-lg border border-black/5">
            <iframe
              title="Sritech Solutions location"
              src={
                settings?.mapEmbedUrl ||
                `https://www.google.com/maps?q=${encodeURIComponent(settings?.address || "Sritech Solutions, Ratnaveni Complex, 1st Lane, Dwarakanagar, Visakhapatnam - 530016")}&output=embed`
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-black/5 p-6">
          <div>
            <label className="text-sm font-medium text-navy-900">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="mt-1 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-navy-900">Phone</label>
              <input
                {...register("phone", { required: "Phone is required" })}
                className="mt-1 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-navy-900">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="mt-1 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-navy-900">Subject</label>
            <input
              {...register("subject", { required: "Subject is required" })}
              className="mt-1 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
            />
            {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-navy-900">Message</label>
            <textarea
              rows={4}
              {...register("message", { required: "Message is required" })}
              className="mt-1 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
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
