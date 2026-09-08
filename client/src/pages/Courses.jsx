import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import api from "../services/api.js";
import { SkeletonGrid } from "../components/Loader.jsx";

const levels = ["", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (search) params.search = search;
    if (level) params.level = level;

    api
      .get("/courses", { params })
      .then((res) => {
        setCourses(res.data.data);
        setPages(res.data.pagination.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, level, page]);

  return (
    <div>
      <section className="bg-navy-950 py-14 text-white">
        <div className="container-page">
          <span className="eyebrow text-brand-400">Courses</span>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Training built around real hardware</h1>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search courses..."
              className="w-full rounded-md border border-black/10 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-400"
            />
          </div>
          <div className="relative w-full sm:w-72">
            <select
              value={level}
              onChange={(e) => {
                setPage(1);
                setLevel(e.target.value);
              }}
              className="w-full appearance-none rounded-md border border-black/10 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-navy-900 outline-none focus:border-brand-400"
            >
              {levels.map((l) => (
                <option key={l || "all"} value={l}>
                  {l || "All Levels"}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-steel"
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
          ) : courses.length === 0 ? (
            <p className="py-16 text-center text-steel">No courses match your search.</p>
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
                    <h3 className="mt-1 text-base font-semibold text-navy-900 group-hover:text-brand-600">{c.title}</h3>
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

        {pages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded-md text-sm font-medium ${
                  page === i + 1 ? "bg-brand-500 text-white" : "bg-mist text-steel hover:bg-brand-50"
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

export default Courses;
