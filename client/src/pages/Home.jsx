import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineChip,
  HiOutlineCog,
  HiOutlineAcademicCap,
  HiOutlineLightBulb,
  HiOutlineArrowRight,
} from "react-icons/hi";
import api from "../services/api.js";
import { SkeletonGrid } from "../components/Loader.jsx";

const services = [
  { icon: HiOutlineChip, title: "Embedded System Design", desc: "End-to-end design and development of dedicated embedded computing systems." },
  { icon: HiOutlineCog, title: "Industrial Automation", desc: "PLC, sensor and control-driven automation solutions for real production lines." },
  { icon: HiOutlineAcademicCap, title: "Research & Training", desc: "Hands-on programs covering the latest tools, boards and protocols." },
  { icon: HiOutlineLightBulb, title: "Student Project Guidance", desc: "Final year and innovative project mentoring for Diploma to M.Tech students." },
];

const stats = [
  { value: "500+", label: "Students Trained" },
  { value: "120+", label: "Projects Delivered" },
  { value: "15+", label: "Industry Partners" },
  { value: "8", label: "Branches Supported" },
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/courses", { params: { limit: 3 } }),
      api.get("/projects", { params: { limit: 3 } }),
      api.get("/gallery", { params: { limit: 6 } }),
    ])
      .then(([c, p, g]) => {
        setCourses(c.data.data);
        setProjects(p.data.data);
        setGallery(g.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(31,119,245,0.35) 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-700/20 blur-3xl" />

        <div className="container-page relative grid gap-12 py-24 lg:grid-cols-2 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow rounded-full bg-brand-500/10 px-3 py-1 text-brand-400">
              Embedded Systems • Automation • Student Innovation
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              We engineer the dedicated systems inside tomorrow's devices.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-mist/70">
              SriTech Embedded Projects designs embedded hardware and software, builds industrial
              automation, and trains students from Diploma to M.Tech to take real projects from idea
              to working prototype.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/courses" className="btn-primary">
                Explore Courses <HiOutlineArrowRight />
              </Link>
              <Link to="/projects" className="btn-outline">
                View Projects
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-mist/50">
                <span>board-status.log</span>
                <span className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                </span>
              </div>
              <div className="mt-4 space-y-2 font-mono text-xs text-brand-300">
                <p>&gt; init sensors ......... OK</p>
                <p>&gt; connect mqtt broker ... OK</p>
                <p>&gt; calibrate IMU ......... OK</p>
                <p>&gt; deploy firmware v2.3 .. DONE</p>
                <p className="text-mist/60">&gt; awaiting next reading_</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="container-page relative grid grid-cols-2 gap-6 border-t border-white/10 py-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl font-semibold text-white sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs text-mist/50 sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SNAPSHOT */}
      <section className="section container-page grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="eyebrow">Who we are</span>
          <h2 className="mt-3 text-3xl font-semibold text-navy-900 sm:text-4xl">
            Practical engineering, taught and delivered by practitioners.
          </h2>
          <p className="mt-4 max-w-xl text-steel">
            We focus on Embedded Systems — specialized computing built to perform dedicated functions
            inside larger devices — and we bridge the gap between theoretical learning and industrial
            application through hands-on solutions and mentorship.
          </p>
          <Link to="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700">
            More about SriTech <HiOutlineArrowRight />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="rounded-lg border border-black/5 p-5">
              <s.icon className="text-brand-500" size={26} />
              <h3 className="mt-3 text-sm font-semibold text-navy-900">{s.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-steel">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section bg-mist">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Latest Projects</span>
              <h2 className="mt-2 text-2xl font-semibold text-navy-900 sm:text-3xl">From concept board to working prototype</h2>
            </div>
            <Link to="/projects" className="font-semibold text-brand-600 hover:text-brand-700">
              View all projects →
            </Link>
          </div>

          <div className="mt-8">
            {loading ? (
              <SkeletonGrid count={3} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <Link
                    key={p._id}
                    to={`/projects/${p.slug}`}
                    className="group overflow-hidden rounded-lg border border-black/5 bg-white transition-shadow hover:shadow-lg"
                  >
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt={p.title} className="h-40 w-full object-cover" />
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-brand-600 to-navy-900" />
                    )}
                    <div className="p-5">
                      <span className="text-xs font-semibold uppercase text-brand-600">{p.domain}</span>
                      <h3 className="mt-1 text-base font-semibold text-navy-900 group-hover:text-brand-600">
                        {p.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-steel">{p.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="section container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Latest Courses</span>
            <h2 className="mt-2 text-2xl font-semibold text-navy-900 sm:text-3xl">Build real skills, not just theory</h2>
          </div>
          <Link to="/courses" className="font-semibold text-brand-600 hover:text-brand-700">
            View all courses →
          </Link>
        </div>

        <div className="mt-8">
          {loading ? (
            <SkeletonGrid count={3} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((c) => (
                <Link
                    key={c._id}
                    to={`/courses/${c.slug}`}
                  className="group overflow-hidden rounded-lg border border-black/5 bg-white transition-shadow hover:shadow-lg"
                >
                    {c.image ? (
                      <img src={c.image} alt={c.title} className="h-40 w-full object-cover" />
                  ) : (
                      <div className="h-40 bg-gradient-to-br from-navy-800 to-brand-700" />
                  )}
                  <div className="p-5">
                      <span className="text-xs font-semibold uppercase text-brand-600">{c.level}</span>
                    <h3 className="mt-1 text-base font-semibold text-navy-900 group-hover:text-brand-600">
                        {c.title}
                    </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-steel">{c.description}</p>
                      <div className="mt-4 flex items-center justify-between text-sm text-steel">
                        <span>{c.duration}</span>
                        <span className="font-semibold text-navy-900">₹{c.fee}</span>
                      </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="section bg-mist">
          <div className="container-page">
            <span className="eyebrow">Gallery</span>
            <h2 className="mt-2 text-2xl font-semibold text-navy-900 sm:text-3xl">Life at SriTech</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {gallery.map((g) => (
                <div key={g._id} className="aspect-square overflow-hidden rounded-lg bg-navy-800">
                  <img src={g.image} alt={g.title || g.category} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link to="/gallery" className="font-semibold text-brand-600 hover:text-brand-700">
                View full gallery →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT CTA */}
      <section className="section container-page">
        <div className="rounded-2xl bg-navy-950 px-8 py-14 text-center text-white">
          <h2 className="text-2xl font-semibold sm:text-3xl">Have a project idea or training need?</h2>
          <p className="mx-auto mt-3 max-w-xl text-mist/70">
            Talk to our team about final year projects, industrial automation, or training programs
            tailored to your branch and year.
          </p>
          <Link to="/contact" className="btn-primary mt-6 inline-flex">
            Get in Touch <HiOutlineArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
