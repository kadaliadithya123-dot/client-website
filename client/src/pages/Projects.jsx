import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiOutlineUsers } from "react-icons/hi";
import api from "../services/api.js";
import { SkeletonGrid } from "../components/Loader.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    api
      .get("/domains")
      .then((res) => setDomains(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (search) params.search = search;
    if (domain) params.domain = domain;

    api
      .get("/projects", { params })
      .then((res) => {
        setProjects(res.data.data);
        setPages(res.data.pagination.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, domain, page]);

  return (
    <div className="transition-colors duration-200">
      {/* Header Banner */}
      <section className="border-b border-slate-200 bg-slate-100 py-14 text-navy-950 transition-colors duration-200 dark:border-transparent dark:bg-navy-950 dark:text-white">
        <div className="container-page">
          <span className="eyebrow text-brand-600 dark:text-brand-400">Projects Showcase</span>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-navy-950 dark:text-white">
            Ideas that shipped as working prototypes
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-mist/70">
            Browse through real final-year, diploma, and innovative embedded projects built by students mentored at SriTech.
          </p>
        </div>
      </section>

      {/* Filters and Project Grid */}
      <section className="container-page py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-mist/40" size={18} />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search projects..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-navy-900 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-400"
            />
          </div>

          <div className="relative w-full sm:w-72">
            <select
              value={domain}
              onChange={(e) => {
                setPage(1);
                setDomain(e.target.value);
              }}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-navy-900 outline-none transition-colors focus:border-brand-500 dark:border-white/10 dark:bg-navy-900 dark:text-white dark:focus:border-brand-400"
            >
              <option value="">All Domains</option>
              {domains.map((d) => (
                <option key={d._id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-mist/40"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : projects.length === 0 ? (
            <p className="py-16 text-center text-slate-500 dark:text-mist/50">No projects match your search.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <Link
                  key={p._id}
                  to={`/projects/${p.slug}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-navy-900/60"
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-brand-600 dark:text-brand-400">{p.domain}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-mist/50">
                        <HiOutlineUsers /> {p.teamSize}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-base font-bold text-navy-950 group-hover:text-brand-600 transition-colors dark:text-white dark:group-hover:text-brand-400">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-mist/70 leading-relaxed">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                  page === i + 1
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/25"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-mist/80 dark:hover:bg-white/10"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Projects;
