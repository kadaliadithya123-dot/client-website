import { HiOutlineCheckCircle } from "react-icons/hi";
import { useContent } from "../hooks/useContent.js";

const defaultTimeline = [
  { year: "2016", text: "SriTech founded to bridge classroom learning and real embedded hardware." },
  { year: "2019", text: "Expanded into industrial automation projects for regional manufacturers." },
  { year: "2022", text: "Crossed 500 students trained across ECE, EEE, CSE and Biomedical streams." },
  { year: "2025", text: "Launched dedicated IoT and AI-on-edge training tracks." },
];

const defaultIndustries = ["Electronics", "IoT", "Robotics", "Biomedical", "Automation", "AI"];

const expertise = [
  "Embedded System Design & Development",
  "Industrial Automation Solutions",
  "Software & Hardware Development",
  "Custom Development Boards",
  "Sensors & Electronic Components",
  "Laboratory Instrumentation",
];

const parseJsonArray = (raw, fallback) => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const About = () => {
  const { content } = useContent();

  const timeline = parseJsonArray(content["about.timeline"], defaultTimeline);
  const industries = parseJsonArray(content["about.industries"], defaultIndustries);

  return (
    <div className="transition-colors duration-200">
      {/* Header Banner */}
      <section className="border-b border-slate-200 bg-slate-50 py-14 text-navy-950 transition-colors duration-200 dark:border-white/10 dark:bg-navy-900/60 dark:text-white">
        <div className="container-page">
          <span className="eyebrow text-brand-600 dark:text-brand-400">About SriTech</span>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl text-slate-900 dark:text-white">
            Engineering education that ends with a working prototype.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-700 leading-relaxed dark:text-mist/80">
            We focus on Embedded Systems - specialized computing systems designed to perform dedicated
            functions within larger devices - and we guide students through Innovative and Final Year Projects.
          </p>
        </div>
      </section>

      {/* Mission & Vision & Expertise */}
      <section className="section container-page grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
          <p className="mt-3 text-slate-700 leading-relaxed dark:text-mist/80">
            {content["about.mission"] ||
              "To bridge the gap between theoretical learning and industrial applications through practical and innovative solutions - for students, and for the industries we partner with."}
          </p>
          <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
          <p className="mt-3 text-slate-700 leading-relaxed dark:text-mist/80">
            {content["about.vision"] ||
              "To be the trusted partner for embedded innovation in the region - where students build skills that transfer directly into industry, and where companies find dependable hardware and automation partners."}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Expertise</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {expertise.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-slate-700 dark:text-mist/80">
                <HiOutlineCheckCircle className="mt-0.5 shrink-0 text-brand-500" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="section border-y border-slate-200 bg-white transition-colors duration-200 dark:border-white/10 dark:bg-navy-900/60">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Journey</h2>
          <div className="mt-8 space-y-6 border-l-2 border-brand-500/40 pl-6">
            {timeline.map((item, index) => (
              <div key={`${item.year}-${index}`} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-brand-500 ring-4 ring-brand-500/20" />
                <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{item.year}</span>
                <p className="mt-1 text-slate-700 dark:text-mist/80 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Students & Industries */}
      <section className="section container-page">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Students We Support</h2>
        <p className="mt-2 max-w-2xl text-slate-700 leading-relaxed dark:text-mist/80">
          {content["about.students_support"] ||
            "Diploma, B.Tech and M.Tech students across Electronics, Telecommunications, Instrumentation, Biomedical and Computer Science."}
        </p>

        <h2 className="mt-10 text-2xl font-bold text-slate-900 dark:text-white">Industries Served</h2>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {industries.map((industry) => (
            <span
              key={industry}
              className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
            >
              {industry}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;