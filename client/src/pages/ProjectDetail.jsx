import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiOutlineDownload,
  HiOutlinePlay,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineZoomIn,
  HiX,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import api from "../services/api.js";
import Spinner from "../components/Loader.jsx";
import ResponsiveImage from "../components/ResponsiveImage.jsx";

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/projects/${slug}`)
      .then((res) => {
        setProject(res.data.data);
        setActiveImg(0);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-brand-600">
        <Spinner size={32} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-slate-500 dark:text-mist/60">Project not found.</p>
        <Link to="/projects" className="mt-4 inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:underline">
          <HiOutlineArrowLeft /> Back to Projects
        </Link>
      </div>
    );
  }

  const gallery = project.images?.length ? project.images : project.thumbnail ? [project.thumbnail] : [];

  return (
    <div className="transition-colors duration-200">
      {/* Header Banner */}
      <section className="border-b border-slate-200 bg-slate-50 py-14 text-slate-900 transition-colors duration-200 dark:border-white/10 dark:bg-navy-900/60 dark:text-white">
        <div className="container-page">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400 mb-3">
            <HiOutlineArrowLeft /> Back to Projects
          </Link>
          <div>
            <span className="eyebrow text-brand-600 dark:text-brand-400">{project.domain}</span>
            <h1 className="mt-2 max-w-2xl font-display text-3xl font-bold sm:text-4xl text-slate-900 dark:text-white">
              {project.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-700 dark:text-mist/70">
              <span className="flex items-center gap-2">
                <HiOutlineChartBar className="text-brand-500" /> {project.difficulty}
              </span>
              <span className="flex items-center gap-2">
                <HiOutlineUsers className="text-brand-500" /> Team of {project.teamSize}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Gallery */}
      <section className="container-page grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {gallery.length > 0 ? (
            <div>
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-md dark:border-white/10 dark:bg-navy-800"
                aria-label={`Zoom ${project.title} image`}
              >
                <ResponsiveImage
                  src={gallery[activeImg]}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  aspectRatio="aspect-video"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <HiOutlineZoomIn className="text-white opacity-0 drop-shadow-lg transition-opacity group-hover:opacity-100" size={36} />
                </div>
              </button>

              {gallery.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        i === activeImg ? "border-brand-500 ring-2 ring-brand-500/30" : "border-slate-200 opacity-70 hover:opacity-100 dark:border-white/10"
                      }`}
                    >
                      <ResponsiveImage src={img} alt="" className="h-full w-full object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-gradient-to-br from-brand-600 to-navy-900" />
          )}

          <h2 className="mt-8 text-xl font-bold text-slate-900 dark:text-white">Project Overview</h2>
          <p className="mt-3 leading-relaxed text-slate-700 dark:text-mist/70">{project.description}</p>

          {project.technologies?.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-bold text-slate-900 dark:text-white">Technologies Used</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
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

        {/* Lightbox Zoom Modal */}
        {zoomOpen && gallery.length > 0 && (
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
            {gallery.length > 1 && (
              <button
                type="button"
                className="absolute left-3 text-white/70 hover:text-white sm:left-6"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImg((i) => (i - 1 + gallery.length) % gallery.length);
                }}
                aria-label="Previous image"
              >
                <HiChevronLeft size={40} />
              </button>
            )}
            <img
              src={gallery[activeImg]}
              alt={project.title}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
            {gallery.length > 1 && (
              <button
                type="button"
                className="absolute right-3 text-white/70 hover:text-white sm:right-6"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImg((i) => (i + 1) % gallery.length);
                }}
                aria-label="Next image"
              >
                <HiChevronRight size={40} />
              </button>
            )}
          </div>
        )}

        {/* Sidebar Resources */}
        <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-navy-900/60 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-mist/50">Project Resources</h3>
          {project.videoLink && (
            <a
              href={project.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-mist dark:hover:bg-white/10"
            >
              <HiOutlinePlay className="text-brand-500" size={18} />
              <span>Watch Demo Video</span>
            </a>
          )}
          {project.pdfUrl && (
            <a
              href={project.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-mist dark:hover:bg-white/10"
            >
              <HiOutlineDownload className="text-brand-500" size={18} />
              <span>Download Project PDF</span>
            </a>
          )}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10">
            <Link to="/contact" className="btn-primary w-full text-center text-xs">
              Inquire About This Project
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ProjectDetail;
