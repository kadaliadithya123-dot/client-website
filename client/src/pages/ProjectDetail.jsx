import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { HiOutlineDownload, HiOutlinePlay, HiOutlineUsers, HiOutlineChartBar } from "react-icons/hi";
import api from "../services/api.js";
import Spinner from "../components/Loader.jsx";

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

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
        <p className="text-steel">Project not found.</p>
        <Link to="/projects" className="mt-4 inline-block font-semibold text-brand-600">
          Back to Projects
        </Link>
      </div>
    );
  }

  const gallery = project.images?.length ? project.images : project.thumbnail ? [project.thumbnail] : [];

  return (
    <div>
      <section className="bg-navy-950 py-14 text-white">
        <div className="container-page">
          <span className="eyebrow text-brand-400">{project.domain}</span>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">{project.title}</h1>
          <div className="mt-5 flex flex-wrap gap-6 text-sm text-mist/70">
            <span className="flex items-center gap-2">
              <HiOutlineChartBar /> {project.difficulty}
            </span>
            <span className="flex items-center gap-2">
              <HiOutlineUsers /> Team of {project.teamSize}
            </span>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {gallery.length > 0 ? (
            <div>
              <div className="aspect-video overflow-hidden rounded-lg bg-navy-800">
                <img src={gallery[activeImg]} alt={project.title} className="h-full w-full object-cover" />
              </div>
              {gallery.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {gallery.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setActiveImg(i)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                        i === activeImg ? "border-brand-500" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-lg bg-gradient-to-br from-brand-600 to-navy-900" />
          )}

          <h2 className="mt-8 text-xl font-semibold text-navy-900">Overview</h2>
          <p className="mt-3 leading-relaxed text-steel">{project.description}</p>

          {project.technologies?.length > 0 && (
            <>
              <h2 className="mt-8 text-xl font-semibold text-navy-900">Technologies Used</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="space-y-3 rounded-lg border border-black/5 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-steel">Resources</h3>
          {project.videoLink && (
            <a
              href={project.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full !border-black/10 !text-navy-900 hover:!bg-mist"
            >
              <HiOutlinePlay /> Watch Demo Video
            </a>
          )}
          {project.pdfUrl && (
            <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
              <HiOutlineDownload /> Download PDF
            </a>
          )}
          <Link to="/contact" className="block pt-2 text-center text-sm font-medium text-brand-600 hover:text-brand-700">
            Want something similar? Talk to us
          </Link>
        </aside>
      </section>
    </div>
  );
};

export default ProjectDetail;
