import { useEffect, useState, useRef, useCallback } from "react";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import api from "../services/api.js";
import { useContent } from "../hooks/useContent.js";
import ResponsiveImage from "../components/ResponsiveImage.jsx";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const loaderRef = useRef(null);
  const { content } = useContent();

  useEffect(() => {
    api
      .get("/gallery-categories")
      .then((res) => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  const fetchImages = useCallback(async (cat, p, replace = false) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12 };
      if (cat) params.category = cat;
      const res = await api.get("/gallery", { params });
      const newImages = res.data.data;
      setImages((prev) => (replace ? newImages : [...prev, ...newImages]));
      setHasMore(newImages.length === 12);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchImages(category, 1, true);
  }, [category, fetchImages]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => {
            const next = p + 1;
            fetchImages(category, next, false);
            return next;
          });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, category, fetchImages]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showNext = useCallback(() => setLightboxIndex((i) => (i + 1) % images.length), [images.length]);
  const showPrev = useCallback(() => setLightboxIndex((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, showNext, showPrev]);

  return (
    <div className="transition-colors duration-200">
      {/* Header Banner */}
      <section className="border-b border-slate-200 bg-slate-50 py-14 text-slate-900 transition-colors duration-200 dark:border-white/10 dark:bg-navy-900/60 dark:text-white">
        <div className="container-page">
          <span className="eyebrow text-brand-600 dark:text-brand-400">
            {content["gallery.header_eyebrow"] || "Gallery"}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-slate-900 dark:text-white">
            {content["gallery.header_title"] || "Events, workshops and life in the lab"}
          </h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-mist/70">
            Moments captured from hands-on training sessions, project demos, workshops, and exhibitions.
          </p>
        </div>
      </section>

      {/* Categories Filter & Grid */}
      <section className="container-page py-10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === ""
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/25"
                : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-transparent dark:bg-white/5 dark:text-mist/80 dark:hover:bg-white/10"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setCategory(cat.name)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat.name
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/25"
                  : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-transparent dark:bg-white/5 dark:text-mist/80 dark:hover:bg-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <button
              key={img._id}
              onClick={() => setLightboxIndex(i)}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-navy-900/60"
            >
              <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-navy-800">
                <ResponsiveImage
                  src={img.image}
                  alt={img.title || img.category}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  aspectRatio="aspect-square"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {img.category}
                </span>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-900 dark:text-white">
                  {img.title || <span className="text-slate-400 dark:text-mist/40">No description</span>}
                </p>
              </div>
            </button>
          ))}
        </div>

        {images.length === 0 && !loading && (
          <p className="py-16 text-center text-slate-500 dark:text-mist/50">No images in this category yet.</p>
        )}
        <div ref={loaderRef} className="h-10" />
        {loading && <p className="text-center text-sm text-slate-500 dark:text-mist/50">Loading more photos...</p>}
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute right-5 top-5 text-white/80 hover:text-white"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <HiX size={30} />
          </button>
          <button
            type="button"
            className="absolute left-3 text-white/70 hover:text-white sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous image"
          >
            <HiChevronLeft size={36} />
          </button>
          <div className="flex max-h-[90vh] max-w-[90vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex].image}
              alt=""
              className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            {images[lightboxIndex].title && (
              <p className="mt-3 max-w-lg text-center text-sm font-medium text-white/90">
                {images[lightboxIndex].title}
              </p>
            )}
          </div>
          <button
            type="button"
            className="absolute right-3 text-white/70 hover:text-white sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
          >
            <HiChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;