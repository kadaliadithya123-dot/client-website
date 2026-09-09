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
import CountUp from "../components/CountUp.jsx";

const services = [
  { icon: HiOutlineChip, title: "Embedded System Design", desc: "End-to-end design and development of dedicated embedded computing systems." },
  { icon: HiOutlineCog, title: "Industrial Automation", desc: "PLC, sensor and control-driven automation solutions for real production lines." },
  { icon: HiOutlineAcademicCap, title: "Research & Training", desc: "Hands-on programs covering the latest tools, boards and protocols." },
  { icon: HiOutlineLightBulb, title: "Student Project Guidance", desc: "Final year and innovative project mentoring for Diploma to M.Tech students." },
];

// Falls back to these if Settings hasn't loaded yet
const defaultStats = { studentsTrained: 500, projectsDelivered: 120, industryPartners: 15, branchesSupported: 8 };

// Section fades in/out as it enters/leaves the viewport
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};
const fadeUpProps = {
  variants: fadeUp,
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.7, ease: "easeOut" },
};

// Grid cards stagger in one after another instead of popping in together
const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const staggerCard = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/courses", { params: { limit: 3 } }),
      api.get("/projects", { params: { limit: 3 } }),
      api.get("/gallery", { params: { limit: 6 } }),
      api.get("/settings"),
    ])
      .then(([c, p, g, s]) => {
        setCourses(c.data.data);
        setProjects(p.data.data);
        setGallery(g.data.data);
        setSettings(s.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { value: settings?.studentsTrained ?? defaultStats.studentsTrained, suffix: "+", label: "Students Trained" },
    { value: settings?.projectsDelivered ?? defaultStats.projectsDelivered, suffix: "+", label: "Projects Delivered" },
    { value: settings?.industryPartners ?? defaultStats.industryPartners, suffix: "+", label: "Industry Partners" },
    { value: settings?.branchesSupported ?? defaultStats.branchesSupported, suffix: "", label: "Branches Supported" },
  ];

  useEffect(() => {
    document.documentElement.classList.add("snap-scroll");
    return () => document.documentElement.classList.remove("snap-scroll");
  }, []);

  return (
    <div>
      {/* HERO */}
      <motion.section
        {...fadeUpProps}
        className="snap-section relative flex min-h-screen flex-col justify-center overflow-hidden bg-navy-950 text-white"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(31,119,245,0.35) 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-700/20 blur-3xl" />

        <div className="container-page relative grid gap-12 py-24 lg:grid-cols-2 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow inline-block max-w-full rounded-full bg-brand-500/10 px-3 py-1 text-xs leading-relaxed text-brand-400 sm:text-sm">
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
              <Link to="/projects" className="btn-primary">
                Explore Projects <HiOutlineArrowRight />
              </Link>
              <Link to="/courses" className="btn-outline">
                View Courses
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
              <div className="font-display text-2xl font-semibold text-white sm:text-3xl">
                {loading ? "0" : <CountUp value={s.value} suffix={s.suffix} />}
              </div>
              <div className="mt-1 text-xs text-mist/50 sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ABOUT SNAPSHOT — now dark, glass-style cards instead of plain white */}
      <motion.section
        {...fadeUpProps}
        className="snap-section relative flex min-h-screen flex-col justify-center overflow-hidden bg-navy-900 text-white"
      >
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="container-page relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow text-brand-400">Who we are</span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Practical engineering, taught and delivered by practitioners.
            </h2>
            <p className="mt-4 max-w-xl text-mist/70">
              We focus on Embedded Systems — specialized computing built to perform dedicated functions
              inside larger devices — and we bridge the gap between theoretical learning and industrial
              application through hands-on solutions and mentorship.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-400 hover:text-brand-300">
              More about SriTech <HiOutlineArrowRight />
            </Link>
          </div>
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {services.map((s) => (
              <motion.div
                key={s.title}
                variants={staggerCard}
                className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur transition-colors hover:border-brand-500/40 hover:bg-white/[0.08]"
              >
                <s.icon className="text-brand-400" size={26} />
                <h3 className="mt-3 text-sm font-semibold text-white">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-mist/60">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* PROJECTS */}
      <motion.section {...fadeUpProps} className="snap-section section flex min-h-screen flex-col justify-center bg-cloud">
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
              <motion.div
                variants={staggerParent}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {projects.map((p) => (
                  <motion.div key={p._id} variants={staggerCard}>
                    <Link
                      to={`/projects/${p.slug}`}
                      className="group block overflow-hidden rounded-lg border border-black/5 bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      {p.thumbnail ? (
                        <img src={p.thumbnail} alt={p.title} className="h-40 w-full object-cover" />
                      ) : (
                        <div className="h-40 bg-gradient-to-br from-brand-600 to-navy-900" />
                      )}
                      <div className="p-5">
                        <span className="text-xs font-semibold uppercase text-brand-600">{p.domain}</span>
                        <h3 className="mt-1 text-base font-semibold text-navy-900 group-hover:text-brand-600">{p.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-steel">{p.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* COURSES */}
      <motion.section {...fadeUpProps} className="snap-section relative flex min-h-screen flex-col justify-center overflow-hidden bg-navy-950 text-white">
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-brand-700/10 blur-3xl" />
        <div className="container-page relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-brand-400">Latest Courses</span>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Build real skills, not just theory</h2>
            </div>
            <Link to="/courses" className="font-semibold text-brand-400 hover:text-brand-300">
              View all courses →
            </Link>
          </div>

          <div className="mt-8">
            {loading ? (
              <SkeletonGrid count={3} />
            ) : (
              <motion.div
                variants={staggerParent}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {courses.map((c) => (
                  <motion.div key={c._id} variants={staggerCard}>
                    <Link
                      to={`/courses/${c.slug}`}
                      className="group block overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur transition-all hover:-translate-y-1 hover:border-brand-500/40 hover:bg-white/[0.08]"
                    >
                      {c.image ? (
                        <img src={c.image} alt={c.title} className="h-40 w-full object-cover" />
                      ) : (
                        <div className="h-40 bg-gradient-to-br from-navy-800 to-brand-700" />
                      )}
                      <div className="p-5">
                        <span className="text-xs font-semibold uppercase text-brand-400">{c.level}</span>
                        <h3 className="mt-1 text-base font-semibold text-white">{c.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-mist/60">{c.description}</p>
                        <div className="mt-4 flex items-center justify-between text-sm text-mist/50">
                          <span>{c.duration}</span>
                          <span className="font-semibold text-white">₹{c.fee}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <motion.section {...fadeUpProps} className="snap-section section flex min-h-screen flex-col justify-center bg-cloud">
          <div className="container-page">
            <span className="eyebrow">Gallery</span>
            <h2 className="mt-2 text-2xl font-semibold text-navy-900 sm:text-3xl">Life at SriTech</h2>
            <motion.div
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            >
              {gallery.map((g) => (
                <motion.div key={g._id} variants={staggerCard} className="aspect-square overflow-hidden rounded-lg bg-navy-800">
                  <img src={g.image} alt={g.title || g.category} className="h-full w-full object-cover" loading="lazy" />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-6 text-center">
              <Link to="/gallery" className="font-semibold text-brand-600 hover:text-brand-700">
                View full gallery →
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* CONTACT CTA — full dark section instead of a dark card floating on white */}
      <motion.section {...fadeUpProps} className="snap-section relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy-950 text-center text-white">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="container-page relative">
          <h2 className="text-2xl font-semibold sm:text-3xl">Have a project idea or training need?</h2>
          <p className="mx-auto mt-3 max-w-xl text-mist/70">
            Talk to our team about final year projects, industrial automation, or training programs
            tailored to your branch and year.
          </p>
          <Link to="/contact" className="btn-primary mt-6 inline-flex">
            Get in Touch <HiOutlineArrowRight />
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
