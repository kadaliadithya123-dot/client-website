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
import { formatCount } from "../utils/formatCount.js";
import { useContent } from "../hooks/useContent.js";
import ResponsiveImage from "../components/ResponsiveImage.jsx";

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

// Grid cards stagger in one after another
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
  const [visitorCount, setVisitorCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const { content } = useContent();

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

  useEffect(() => {
    api
      .post("/visitors/track")
      .then((res) => setVisitorCount(res.data.data.count))
      .catch(() => {});
  }, []);

  const stats = [
    { value: settings?.studentsTrained ?? defaultStats.studentsTrained, suffix: "+", label: settings?.studentsTrainedLabel || "Students Trained" },
    { value: settings?.projectsDelivered ?? defaultStats.projectsDelivered, suffix: "+", label: settings?.projectsDeliveredLabel || "Projects Delivered" },
    { value: settings?.industryPartners ?? defaultStats.industryPartners, suffix: "+", label: settings?.industryPartnersLabel || "Industry Partners" },
  ];

  useEffect(() => {
    document.documentElement.classList.add("snap-scroll");
    return () => document.documentElement.classList.remove("snap-scroll");
  }, []);

  return (
    <div className="transition-colors duration-200">
      {/* HERO SECTION — responsive light/dark theme */}
      <motion.section
        {...fadeUpProps}
        className="snap-section relative flex min-h-[90vh] flex-col justify-center overflow-hidden bg-white text-navy-950 transition-colors duration-200 dark:bg-navy-950 dark:text-white"
      >
        <div
          className="absolute inset-0 opacity-20 dark:opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(31,119,245,0.4) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/20" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-700/10 blur-3xl dark:bg-brand-700/20" />

        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow inline-block max-w-full rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold leading-relaxed text-brand-600 sm:text-sm dark:text-brand-400">
              {content["home.hero.badge"] || "Embedded Systems • Automation • Student Innovation"}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-navy-950 sm:text-5xl lg:text-6xl dark:text-white">
              {content["home.hero.title"] || "We engineer the dedicated systems inside tomorrow's devices."}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600 dark:text-mist/70">
              {content["home.hero.subtitle"] ||
                "SriTech Embedded Projects designs embedded hardware and software, builds industrial automation, and trains students from Diploma to M.Tech to take real projects from idea to working prototype."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/projects" className="btn-primary">
                {content["home.hero.cta_primary"] || "Explore Projects"} <HiOutlineArrowRight />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-white/30 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
              >
                {content["home.hero.cta_secondary"] || "View Courses"}
              </Link>
            </div>
          </motion.div>

          {/* Interactive Board Status Simulation Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50/90 p-6 shadow-xl backdrop-blur transition-colors dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-mist/50">
                <span className="font-mono">board-status.log</span>
                <span className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                </span>
              </div>
              <div className="mt-4 space-y-2 font-mono text-xs text-brand-600 dark:text-brand-300">
                <p>&gt; init sensors ......... OK</p>
                <p>&gt; connect mqtt broker ... OK</p>
                <p>&gt; calibrate IMU ......... OK</p>
                <p>&gt; deploy firmware v2.3 .. DONE</p>
                <p className="text-slate-400 dark:text-mist/60">&gt; awaiting next reading_</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="container-page relative grid grid-cols-2 gap-6 border-t border-slate-200 py-8 transition-colors sm:grid-cols-4 dark:border-white/10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl font-bold text-navy-950 sm:text-3xl dark:text-white">
                {loading ? "0" : <CountUp value={s.value} suffix={s.suffix} />}
              </div>
              <div className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-mist/50">{s.label}</div>
            </div>
          ))}
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-navy-950 sm:text-3xl dark:text-white">
              {visitorCount == null ? "0" : <CountUp value={visitorCount} formatter={formatCount} />}
            </div>
            <div className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-mist/50">{settings?.branchesSupportedLabel || "Visitors"}</div>
          </div>
        </div>
      </motion.section>

      {/* ABOUT SNAPSHOT SECTION */}
      <motion.section
        {...fadeUpProps}
        className="snap-section relative flex min-h-[80vh] flex-col justify-center overflow-hidden bg-slate-50 py-16 text-navy-950 transition-colors duration-200 sm:py-24 dark:bg-navy-900 dark:text-white"
      >
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="container-page relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow text-brand-600 dark:text-brand-400">Who We Are</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl text-navy-950 dark:text-white">
              Practical engineering, taught and delivered by practitioners.
            </h2>
            <p className="mt-4 max-w-xl text-slate-600 leading-relaxed dark:text-mist/70">
              We focus on Embedded Systems — specialized computing built to perform dedicated functions
              inside larger devices — and we bridge the gap between theoretical learning and industrial
              application through hands-on solutions and mentorship.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
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
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-brand-500/40 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:backdrop-blur dark:hover:bg-white/[0.08]"
              >
                <s.icon className="text-brand-500 dark:text-brand-400" size={26} />
                <h3 className="mt-3 text-sm font-semibold text-navy-950 dark:text-white">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-mist/60">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* PROJECTS SECTION */}
      <motion.section {...fadeUpProps} className="snap-section section flex min-h-[80vh] flex-col justify-center bg-white transition-colors duration-200 dark:bg-navy-950">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-brand-600 dark:text-brand-400">Latest Projects</span>
              <h2 className="mt-2 text-2xl font-bold text-navy-950 sm:text-3xl dark:text-white">
                From concept board to working prototype
              </h2>
            </div>
            <Link to="/projects" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
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
                      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-navy-900/60"
                    >
                      {p.thumbnail ? (
                        <ResponsiveImage
                          src={p.thumbnail}
                          alt={p.title}
                          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          aspectRatio="h-44"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="h-44 bg-gradient-to-br from-brand-600 to-navy-900" />
                      )}
                      <div className="p-5">
                        <span className="text-xs font-semibold uppercase text-brand-600 dark:text-brand-400">{p.domain}</span>
                        <h3 className="mt-1 text-base font-bold text-navy-950 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                          {p.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-mist/70">{p.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* COURSES SECTION */}
      <motion.section
        {...fadeUpProps}
        className="snap-section relative flex min-h-[80vh] flex-col justify-center overflow-hidden bg-slate-50 py-16 text-navy-950 transition-colors duration-200 sm:py-24 dark:bg-navy-900 dark:text-white"
      >
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-brand-700/10 blur-3xl" />
        <div className="container-page relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-brand-600 dark:text-brand-400">Latest Courses</span>
              <h2 className="mt-2 text-2xl font-bold text-navy-950 sm:text-3xl dark:text-white">Build real skills, not just theory</h2>
            </div>
            <Link to="/courses" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
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
                      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:backdrop-blur dark:hover:border-brand-500/40"
                    >
                      {c.image ? (
                        <ResponsiveImage
                          src={c.image}
                          alt={c.title}
                          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          aspectRatio="h-44"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="h-44 bg-gradient-to-br from-navy-800 to-brand-700" />
                      )}
                      <div className="p-5">
                        <span className="text-xs font-semibold uppercase text-brand-600 dark:text-brand-400">{c.level}</span>
                        <h3 className="mt-1 text-base font-bold text-navy-950 dark:text-white">{c.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-mist/60">{c.description}</p>
                        <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-mist/50">
                          <span>{c.duration}</span>
                          <span className="font-semibold text-navy-950 dark:text-white">₹{c.fee}</span>
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

      {/* GALLERY PREVIEW SECTION */}
      {gallery.length > 0 && (
        <motion.section {...fadeUpProps} className="snap-section section flex min-h-[70vh] flex-col justify-center bg-white transition-colors duration-200 dark:bg-navy-950">
          <div className="container-page">
            <span className="eyebrow text-brand-600 dark:text-brand-400">Gallery</span>
            <h2 className="mt-2 text-2xl font-bold text-navy-950 sm:text-3xl dark:text-white">Life at SriTech</h2>
            <motion.div
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            >
              {gallery.map((g) => (
                <motion.div key={g._id} variants={staggerCard} className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-navy-800">
                  <ResponsiveImage
                    src={g.image}
                    alt={g.title || g.category}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    aspectRatio="aspect-square"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-6 text-center">
              <Link to="/gallery" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                View full gallery →
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* CONTACT CTA SECTION */}
      <motion.section
        {...fadeUpProps}
        className="snap-section relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-slate-100 py-16 text-center text-navy-950 transition-colors duration-200 dark:bg-navy-950 dark:text-white"
      >
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="container-page relative">
          <h2 className="text-2xl font-bold sm:text-4xl text-navy-950 dark:text-white">Have a project idea or training need?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-mist/70">
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
