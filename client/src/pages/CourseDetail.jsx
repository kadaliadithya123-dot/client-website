import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineUser, HiOutlineCheckCircle, HiX } from "react-icons/hi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../services/api.js";
import Spinner from "../components/Loader.jsx";

const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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
      await api.post("/enrollments", { ...data, courseId: course._id });
      toast.success("Enrollment submitted! Our team will contact you shortly.");
      reset();
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit enrollment");
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
        <p className="text-steel">Course not found.</p>
        <Link to="/courses" className="mt-4 inline-block font-semibold text-brand-600">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-navy-950 py-14 text-white">
        <div className="container-page">
          <span className="eyebrow text-brand-400">{course.level}</span>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">{course.title}</h1>
          <div className="mt-5 flex flex-wrap gap-6 text-sm text-mist/70">
            <span className="flex items-center gap-2">
              <HiOutlineClock /> {course.duration}
            </span>
            <span className="flex items-center gap-2">
              <HiOutlineCurrencyRupee /> ₹{course.fee}
            </span>
            {course.trainer && (
              <span className="flex items-center gap-2">
                <HiOutlineUser /> {course.trainer}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {course.image && (
            <img src={course.image} alt={course.title} className="mb-8 aspect-video w-full rounded-lg object-cover" />
          )}
          <h2 className="text-xl font-semibold text-navy-900">About this course</h2>
          <p className="mt-3 leading-relaxed text-steel">{course.description}</p>

          {course.syllabus?.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-semibold text-navy-900">Syllabus</h2>
              <ul className="mt-4 space-y-2">
                {course.syllabus.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-steel">
                    <HiOutlineCheckCircle className="mt-0.5 shrink-0 text-brand-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </>
          )}

          {course.technologies?.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-semibold text-navy-900">Technologies Covered</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {course.technologies.map((t) => (
                  <span key={t} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="rounded-lg border border-black/5 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-steel">Eligibility</h3>
          <p className="mt-2 text-sm text-navy-900">{course.eligibility || "Open to all interested learners"}</p>
          <button onClick={() => setModalOpen(true)} className="btn-primary mt-6 w-full">
            Enroll Now
          </button>
          <Link to="/contact" className="mt-3 block text-center text-sm font-medium text-brand-600 hover:text-brand-700">
            Ask a question instead
          </Link>
        </aside>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy-900">Enroll in {course.title}</h2>
              <button onClick={() => setModalOpen(false)} className="text-steel hover:text-navy-900">
                <HiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onEnroll)} className="mt-4 space-y-3">
              <div>
                <input
                  placeholder="Full Name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <input
                  placeholder="Phone Number"
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <textarea
                rows={3}
                placeholder="Anything you'd like us to know? (optional)"
                {...register("message")}
                className="w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
              />
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
                {isSubmitting ? "Submitting..." : "Submit Enrollment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
