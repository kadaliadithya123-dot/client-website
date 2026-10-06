import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineZoomIn,
  HiOutlineArrowLeft,
  HiX,
} from "react-icons/hi";
import api from "../services/api.js";
import Spinner from "../components/Loader.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";

const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/courses/${slug}`)
      .then((res) => setCourse(res.data.data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const onEnroll = async (data) => {
    try {
      await api.post(`/courses/${course._id}/enroll`, data);
      toast.success("Enrollment request submitted! We'll contact you shortly.");
      setModalOpen(false);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-brand-600">
        <Spinner size={32} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-slate-500 dark:text-mist/60">Course not found.</p>
        <Link to="/courses" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:underline">
          <HiOutlineArrowLeft /> Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="transition-colors duration-200">
      {/* Header Banner — smooth gradual transition without dividing lines */}
      <section className="bg-gradient-to-b from-slate-100/60 via-slate-50/40 to-transparent py-14 text-navy-950 transition-colors duration-300 dark:from-navy-900/50 dark:via-navy-950/40 dark:to-transparent dark:text-white">
        <div className="container-page">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400 mb-3">
            <HiOutlineArrowLeft /> Back to Courses
          </Link>
          <div>
            <span className="eyebrow text-brand-600 dark:text-brand-400">{course.level}</span>
            <h1 className="mt-2 max-w-2xl font-display text-3xl font-bold sm:text-4xl text-navy-950 dark:text-white">
              {course.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-mist/70">
              <span className="flex items-center gap-2">
                <HiOutlineClock className="text-brand-500" /> {course.duration}
              </span>
              <span className="flex items-center gap-2 font-semibold text-navy-950 dark:text-white">
                <HiOutlineCurrencyRupee className="text-brand-500" /> ₹{course.fee}
              </span>
              {course.trainer && (
                <span className="flex items-center gap-2">
                  <HiOutlineAcademicCap className="text-brand-500" /> {course.trainer}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Detail Content */}
      <section className="container-page grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {course.image && (
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              className="group relative mb-8 block aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-md dark:border-white/10 dark:bg-navy-800"
              aria-label={`Zoom ${course.title} image`}
            >
              <ResponsiveImage
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                aspectRatio="aspect-video"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                <HiOutlineZoomIn className="text-white opacity-0 drop-shadow-lg transition-opacity group-hover:opacity-100" size={36} />
              </div>
            </button>
          )}

          <h2 className="text-xl font-bold text-navy-950 dark:text-white">About this course</h2>
          <p className="mt-3 leading-relaxed text-slate-600 dark:text-mist/70">{course.description}</p>

          {course.syllabus?.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-bold text-navy-950 dark:text-white">Syllabus & Modules</h2>
              <ul className="mt-4 space-y-2.5">
                {course.syllabus.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-mist/80">
                    <HiOutlineCheckCircle className="mt-0.5 shrink-0 text-brand-500" size={18} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {course.technologies?.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-bold text-navy-950 dark:text-white">Technologies Covered</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {course.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar Enrollment Card */}
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-navy-900/60">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-mist/50">Eligibility</h3>
          <p className="mt-2 text-sm font-medium text-navy-950 dark:text-white">{course.eligibility || "Open to all engineering & diploma students"}</p>
          <button onClick={() => setModalOpen(true)} className="btn-primary mt-6 w-full">
            Enroll Now
          </button>
          <Link to="/contact" className="mt-3 block text-center text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
            Ask a question instead
          </Link>
        </aside>
      </section>

      {/* Lightbox Image Zoom */}
      {zoomOpen && course.image && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 text-white/80 hover:text-white"
            onClick={() => setZoomOpen(false)}
            aria-label="Close image zoom"
          >
            <HiX size={30} />
          </button>
          <img
            src={course.image}
            alt={course.title}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}

      {/* Enrollment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-navy-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-950 dark:text-white">Enroll in {course.title}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-navy-950 dark:text-mist/50 dark:hover:text-white">
                <HiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onEnroll)} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-mist/80">Full Name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
                  placeholder="Your full name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-mist/80">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-mist/80">Phone</label>
                <input
                  {...register("phone", { required: "Phone is required" })}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
                  placeholder="10-digit mobile number"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-mist/80">College</label>
                  <input
                    {...register("college")}
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
                    placeholder="e.g. AU COE"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-mist/80">Branch</label>
                  <input
                    {...register("branch")}
                    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
                    placeholder="e.g. ECE / EEE"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
                  {isSubmitting ? "Submitting..." : "Submit Enrollment Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
